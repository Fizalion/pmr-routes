type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  is_bot?: boolean;
};

type TelegramMessage = {
  message_id: number;
  from?: TelegramUser;
  chat: {
    id: number;
    type: string;
  };
  text?: string;
  photo?: { file_id: string }[];
  document?: { file_id: string };
  reply_to_message?: TelegramMessage;
};

export const config = { runtime: "edge" };

type TelegramUpdate = {
  message?: TelegramMessage;
};

const HELP_TEXT =
  "Бот принимает только информацию о транспорте. " +
  "Не отправляйте материалы 18+, незаконный контент и персональные данные. " +
  "Выберите тему, затем отправьте сообщение, фотографию или файл.";

const feedbackKeyboard = {
  keyboard: [
    [{ text: "Сообщить расписание или источник" }],
    [{ text: "Сообщить об ошибке" }],
    [{ text: "Предложить улучшение" }],
  ],
  resize_keyboard: true,
};

const MISSING_SCHEDULE_PROMPT =
  "Пришлите актуальное расписание или ссылку на надёжный источник.";

const feedbackTopics = new Map([
  [
    "Сообщить расписание или источник",
    {
      source: "feedback_schedule",
      prompt: "Пришлите расписание, фотографию или ссылку на источник.",
    },
  ],
  [
    "Сообщить об ошибке",
    {
      source: "feedback_error",
      prompt: "Опишите ошибку и при необходимости приложите фотографию.",
    },
  ],
  [
    "Предложить улучшение",
    {
      source: "feedback_improvement",
      prompt: "Опишите, что вы предлагаете улучшить.",
    },
  ],
]);

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const getDisplayName = (user: TelegramUser) =>
  escapeHtml([user.first_name, user.last_name].filter(Boolean).join(" "));

const getUsernameLabel = (user: TelegramUser) =>
  user.username
    ? `<a href="https://t.me/${user.username}">@${user.username}</a>`
    : "не указан";

const getAdminCardText = (message: TelegramMessage, source?: string) => {
  if (!message.from) return null;

  return [
    "<b>Новое обращение</b>",
    `Имя: ${getDisplayName(message.from)}`,
    `Username: ${getUsernameLabel(message.from)}`,
    `user_id: <code>${message.from.id}</code>`,
    `chat_id: <code>${message.chat.id}</code>`,
    `Источник: ${escapeHtml(source ?? "неизвестен")}`,
    "Ответьте на это служебное сообщение, чтобы написать пользователю.",
  ].join("\n");
};

const getReplyTargetChatId = (message: TelegramMessage) => {
  const repliedMessage = message.reply_to_message;

  if (!repliedMessage?.from?.is_bot || !repliedMessage.text) return null;

  const chatIdMatch = repliedMessage.text.match(/chat_id: (\d+)/);

  return chatIdMatch ? Number(chatIdMatch[1]) : null;
};

const getMessageSource = (message: TelegramMessage) => {
  const repliedText = message.reply_to_message?.text;

  if (repliedText === MISSING_SCHEDULE_PROMPT) return "missing_schedule";

  for (const topic of feedbackTopics.values()) {
    if (repliedText === topic.prompt) return topic.source;
  }

  return undefined;
};

type TelegramApiResponse<T> = {
  ok: boolean;
  result: T;
};

const sendTelegramRequest = async <T = unknown>(
  method: string,
  body: Record<string, unknown>,
): Promise<T> => {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured");

  const response = await fetch(
    `https://api.telegram.org/bot${token}/${method}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) throw new Error(`Telegram API error: ${response.status}`);

  const data = (await response.json()) as TelegramApiResponse<T>;

  return data.result;
};

const isAuthorizedWebhook = (request: Request) => {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const receivedSecret = request.headers.get("X-Telegram-Bot-Api-Secret-Token");

  return Boolean(expectedSecret && receivedSecret === expectedSecret);
};

const getFeedbackChatId = () => {
  const feedbackChatId = process.env.TELEGRAM_FEEDBACK_CHAT_ID;

  if (!feedbackChatId) {
    throw new Error("TELEGRAM_FEEDBACK_CHAT_ID is not configured");
  }

  return feedbackChatId;
};

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  if (!isAuthorizedWebhook(request)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const update = (await request.json()) as TelegramUpdate;
  if (!update.message) return Response.json({ ok: true });

  if (String(update.message.chat.id) === getFeedbackChatId()) {
    const targetChatId = getReplyTargetChatId(update.message);

    if (!targetChatId || !update.message.text)
      return Response.json({ ok: true });

    try {
      await sendTelegramRequest("sendMessage", {
        chat_id: targetChatId,
        text: update.message.text,
      });
    } catch {
      await sendTelegramRequest("sendMessage", {
        chat_id: update.message.chat.id,
        text: "Не удалось доставить ответ пользователю.",
        reply_parameters: { message_id: update.message.message_id },
      });
      return Response.json({ ok: true });
    }
    await sendTelegramRequest("sendMessage", {
      chat_id: update.message.chat.id,
      text: "Ответ доставлен пользователю.",
      reply_parameters: { message_id: update.message.message_id },
    });
    return Response.json({ ok: true });
  }

  if (update.message.chat.type !== "private") {
    return Response.json({ ok: true });
  }

  const isHelpCommand =
    update.message.text?.startsWith("/start") ||
    update.message.text?.startsWith("/help");
  const isMissingScheduleStart = update.message.text?.startsWith(
    "/start missing_schedule",
  );

  if (isHelpCommand) {
    await sendTelegramRequest("sendMessage", {
      chat_id: update.message.chat.id,
      text: isMissingScheduleStart ? MISSING_SCHEDULE_PROMPT : HELP_TEXT,
      reply_markup: isMissingScheduleStart
        ? { force_reply: true }
        : feedbackKeyboard,
    });
    return Response.json({ ok: true });
  }

  const feedbackTopic = update.message.text
    ? feedbackTopics.get(update.message.text)
    : undefined;

  if (feedbackTopic) {
    await sendTelegramRequest("sendMessage", {
      chat_id: update.message.chat.id,
      text: feedbackTopic.prompt,
      reply_markup: { force_reply: true },
    });
    return Response.json({ ok: true });
  }

  const isSupportedMessage = Boolean(
    update.message.text ||
    update.message.photo?.length ||
    update.message.document,
  );

  if (!isSupportedMessage) {
    await sendTelegramRequest("sendMessage", {
      chat_id: update.message.chat.id,
      text: "Поддерживаются текст, фотографии и документы.",
    });
    return Response.json({ ok: true });
  }

  const forwardedMessage = await sendTelegramRequest<TelegramMessage>(
    "forwardMessage",
    {
      chat_id: getFeedbackChatId(),
      from_chat_id: update.message.chat.id,
      message_id: update.message.message_id,
    },
  );
  const adminCardText = getAdminCardText(
    update.message,
    getMessageSource(update.message),
  );

  if (adminCardText) {
    await sendTelegramRequest("sendMessage", {
      chat_id: getFeedbackChatId(),
      text: adminCardText,
      parse_mode: "HTML",
      reply_parameters: { message_id: forwardedMessage.message_id },
    });
  }
  try {
    await sendTelegramRequest("sendMessage", {
      chat_id: update.message.chat.id,
      text: "Спасибо! Сообщение получено.",
    });
  } catch {
    return Response.json({ ok: true });
  }

  return Response.json({ ok: true });
}
