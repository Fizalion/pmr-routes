type TelegramMessage = {
  message_id: number;
  chat: {
    id: number;
    type: string;
  };
  text?: string;
  photo?: { file_id: string }[];
  document?: { file_id: string };
};

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

const feedbackTopics = new Set([
  "Сообщить расписание или источник",
  "Сообщить об ошибке",
  "Предложить улучшение",
]);

const sendTelegramRequest = async (
  method: string,
  body: Record<string, unknown>,
) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured");

  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error(`Telegram API error: ${response.status}`);
};

const isAuthorizedWebhook = (request: Request) => {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const receivedSecret = request.headers.get(
    "X-Telegram-Bot-Api-Secret-Token",
  );

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
      text: isMissingScheduleStart
        ? "Пришлите актуальное расписание или ссылку на надёжный источник."
        : HELP_TEXT,
      reply_markup: feedbackKeyboard,
    });
    return Response.json({ ok: true });
  }

  if (update.message.text && feedbackTopics.has(update.message.text)) {
    await sendTelegramRequest("sendMessage", {
      chat_id: update.message.chat.id,
      text: "Теперь отправьте сообщение, фотографию или файл.",
    });
    return Response.json({ ok: true });
  }

  const isSupportedMessage = Boolean(
    update.message.text || update.message.photo?.length || update.message.document,
  );

  if (!isSupportedMessage) {
    await sendTelegramRequest("sendMessage", {
      chat_id: update.message.chat.id,
      text: "Поддерживаются текст, фотографии и документы.",
    });
    return Response.json({ ok: true });
  }

  await sendTelegramRequest("forwardMessage", {
    chat_id: getFeedbackChatId(),
    from_chat_id: update.message.chat.id,
    message_id: update.message.message_id,
  });
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
