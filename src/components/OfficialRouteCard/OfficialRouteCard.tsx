import { useState } from "react";
import type { OfficialRoute } from "../../types/officialRoute";
import { feedbackUrl } from "../../config/contact";
import styles from "./OfficialRouteCard.module.css";
import ScheduleDirection from "./ScheduleDirection";

type OfficialRouteCardProps = {
  route: OfficialRoute;
  showStops?: boolean;
};

const OfficialRouteCard = ({
  route,
  showStops = true,
}: OfficialRouteCardProps) => {
  const [areStopsExpanded, setAreStopsExpanded] = useState(false);
  const forwardScheduleId = route.id + "-forward-schedule";
  const backwardScheduleId = route.id + "-backward-schedule";
  const stops = route.stops;
  const hasMoreStops = stops.length > 5;
  const displayedStops = areStopsExpanded ? stops : stops.slice(0, 5);
  const source = route.source.schedule.name;
  const splitDate = route.source.schedule.checkedAt.split("-");
  const checkedAtLabel = new Date(
    Number(splitDate[0]),
    Number(splitDate[1]) - 1,
    Number(splitDate[2]),
  ).toLocaleDateString("ru-RU");

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        {route.officialNumber && (
          <p className={styles.routeNumber}>Маршрут {route.officialNumber}</p>
        )}
        <h2 className={styles.routeName}>{route.name}</h2>
        <p className={styles.category}>{route.category}</p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Расписание</h2>
        <div className={styles.scheduleGrid}>
          <ScheduleDirection
            from={route.directions.forward.from}
            to={route.directions.forward.to}
            departures={route.schedule.forwardDepartures}
            scheduleId={forwardScheduleId}
            status={route.schedule.forwardStatus}
            departurePoint={route.directions.forward.departurePoint}
            arrivalPoint={route.directions.forward.arrivalPoint}
            fare={route.directions.forward.fare}
            travelTimePoints={route.directions.forward.travelTimePoints}
            note={route.schedule.forwardNote}
          />

          <ScheduleDirection
            from={route.directions.backward.from}
            to={route.directions.backward.to}
            departures={route.schedule.backwardDepartures}
            scheduleId={backwardScheduleId}
            status={route.schedule.backwardStatus}
            departurePoint={route.directions.backward.departurePoint}
            arrivalPoint={route.directions.backward.arrivalPoint}
            fare={route.directions.backward.fare}
            travelTimePoints={route.directions.backward.travelTimePoints}
            note={route.schedule.backwardNote}
          />
        </div>
      </section>

      {showStops && stops.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Остановки</h2>
          <ul className={styles.stopList}>
            {displayedStops.map((stop) => (
              <li className={styles.stopItem} key={stop.id}>
                {stop.name}
                {stop.settlement && ` - ${stop.settlement}`}
              </li>
            ))}
          </ul>
          {hasMoreStops && (
            <button
              className={styles.stopsButton}
              type="button"
              onClick={() => setAreStopsExpanded((isExpanded) => !isExpanded)}
            >
              {areStopsExpanded
                ? "Скрыть остановки"
                : `Показать все остановки (${stops.length})`}
            </button>
          )}
        </section>
      )}

      {route.showFeedbackPrompt && (
        <aside className={styles.feedbackPrompt}>
          <strong>Нашли ошибку или информация неактуальна?</strong>
          <a href={feedbackUrl} target="_blank" rel="noreferrer">
            Напишите в Telegram-бот
          </a>
        </aside>
      )}

      <footer className={styles.footer}>
        <p>
          <span>Источник расписания</span>
          {source}
        </p>
        <p>
          <span>Дата проверки</span>
          {checkedAtLabel}
        </p>
      </footer>
    </article>
  );
};

export default OfficialRouteCard;
