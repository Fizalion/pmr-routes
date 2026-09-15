import { useRef } from "react";
import { telegramGroupUrl } from "../../config/contact";

const DeveloperInfo = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <p className="developer-info">
        <span>Разработчик справочника — Олег Обручков</span>
        <span aria-hidden="true">·</span>
        <button type="button" onClick={() => dialogRef.current?.showModal()}>
          О проекте
        </button>
        <span aria-hidden="true">·</span>
        <a href={telegramGroupUrl} target="_blank" rel="noreferrer">Telegram</a>
      </p>

      <dialog ref={dialogRef} className="about-dialog" aria-labelledby="about-title">
        <div className="about-dialog-content">
          <button
            className="about-dialog-close"
            type="button"
            aria-label="Закрыть"
            onClick={() => dialogRef.current?.close()}
          >
            ×
          </button>
          <h2 id="about-title">О справочнике</h2>
          <p>
            Независимый справочник маршрутов ПМР. Я собираю и проверяю расписания,
            добавляю маршруты по запросам пассажиров и развиваю справочник на основе обратной связи.
          </p>
          <p>
            Справочник развивается вместе с пассажирами ПМР — многие маршруты и улучшения
            появляются благодаря их обратной связи.
          </p>
          <p><strong>Разработчик — Олег Обручков (@fizalion)</strong></p>
          <p>Нашли ошибку или есть предложение? Напишите мне.</p>
          <a className="about-dialog-link" href={telegramGroupUrl} target="_blank" rel="noreferrer">
            Написать в Telegram
          </a>
        </div>
      </dialog>
    </>
  );
};

export default DeveloperInfo;
