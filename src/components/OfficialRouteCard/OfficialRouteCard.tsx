import { useState } from "react";
import route075Data from "../../data/route-075.json";
import route076Data from "../../data/route-076.json";
import styles from "./OfficialRouteCard.module.css";

type OfficialRouteCardProps = {
  route: typeof route075Data | typeof route076Data;
  showStops?: boolean;
};

const getDepartureMinutes = (departure: string) => {
  const [hours, minutes] = departure.split(":").map(Number);

  return hours * 60 + minutes;
};

const getUpcomingDepartures = (
  departures: string[],
  currentTimeMinutes: number,
) =>
  departures
    .filter((departure) => getDepartureMinutes(departure) >= currentTimeMinutes)
    .slice(0, 5);

const OfficialRouteCard = ({
  route,
  showStops = true,
}: OfficialRouteCardProps) => {
  const [isForwardScheduleExpanded, setIsForwardScheduleExpanded] =
    useState(false);
  const [isBackwardScheduleExpanded, setIsBackwardScheduleExpanded] =
    useState(false);

  const forwardDepartures = route.schedule.forwardDepartures;
  const backwardDepartures = route.schedule.backwardDepartures;
  const forwardScheduleId = route.id + "-forward-schedule";
  const backwardScheduleId = route.id + "-backward-schedule";
  const stops = route.stops;
  const source = route.source.schedule.name;
  const currentTime = new Date();
  const currentTimeMinutes =
    currentTime.getHours() * 60 + currentTime.getMinutes();
  const upcomingForwardDepartures = getUpcomingDepartures(
    forwardDepartures,
    currentTimeMinutes,
  );
  const upcomingBackwardDepartures = getUpcomingDepartures(
    backwardDepartures,
    currentTimeMinutes,
  );
  const displayedForwardDepartures = isForwardScheduleExpanded
    ? forwardDepartures
    : upcomingForwardDepartures;
  const displayedBackwardDepartures = isBackwardScheduleExpanded
    ? backwardDepartures
    : upcomingBackwardDepartures;
  const splitDate = route.source.schedule.checkedAt.split("-");
  const checkedAtLabel = new Date(
    Number(splitDate[0]),
    Number(splitDate[1]) - 1,
    Number(splitDate[2]),
  ).toLocaleDateString("ru-RU");

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <p className={styles.routeNumber}>Маршрут {route.officialNumber}</p>
        <h2 className={styles.routeName}>{route.name}</h2>
        <p className={styles.category}>{route.category}</p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Расписание</h2>
        <div className={styles.scheduleGrid}>
          <div className={styles.scheduleDirection}>
            <h3 className={styles.directionTitle}>
              {route.directions.forward.from} → {route.directions.forward.to}
            </h3>
            <p className={styles.nextDeparturesLabel}>
              {isForwardScheduleExpanded
                ? "Полное расписание"
                : "Следующие рейсы"}
            </p>
            <div id={forwardScheduleId}>
              {displayedForwardDepartures.length > 0 ? (
                <ul className={styles.departureList}>
                  {displayedForwardDepartures.map((departure, index) => (
                    <li
                      className={styles.departureTime}
                      key={"forward-" + departure + index}
                    >
                      {departure}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.noDepartures}>
                  Следующий рейс завтра в {forwardDepartures[0]}.
                </p>
              )}
            </div>
            <button
              className={styles.scheduleButton}
              type="button"
              aria-controls={forwardScheduleId}
              aria-expanded={isForwardScheduleExpanded}
              onClick={() =>
                setIsForwardScheduleExpanded((isExpanded) => !isExpanded)
              }
            >
              {isForwardScheduleExpanded
                ? "Скрыть полное расписание"
                : "Показать всё расписание"}
            </button>
          </div>

          <div className={styles.scheduleDirection}>
            <h3 className={styles.directionTitle}>
              {route.directions.backward.from} → {route.directions.backward.to}
            </h3>
            <p className={styles.nextDeparturesLabel}>
              {isBackwardScheduleExpanded
                ? "Полное расписание"
                : "Следующие рейсы"}
            </p>
            <div id={backwardScheduleId}>
              {displayedBackwardDepartures.length > 0 ? (
                <ul className={styles.departureList}>
                  {displayedBackwardDepartures.map((departure, index) => (
                    <li
                      className={styles.departureTime}
                      key={"backward-" + departure + index}
                    >
                      {departure}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.noDepartures}>
                  Следующий рейс завтра в {backwardDepartures[0]}.
                </p>
              )}
            </div>
            <button
              className={styles.scheduleButton}
              type="button"
              aria-controls={backwardScheduleId}
              aria-expanded={isBackwardScheduleExpanded}
              onClick={() =>
                setIsBackwardScheduleExpanded((isExpanded) => !isExpanded)
              }
            >
              {isBackwardScheduleExpanded
                ? "Скрыть полное расписание"
                : "Показать всё расписание"}
            </button>
          </div>
        </div>
      </section>

      {showStops && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Остановки</h2>
          <ul className={styles.stopList}>
            {stops.map((stop) => (
              <li className={styles.stopItem} key={stop.id}>
                {stop.name}
                {"settlement" in stop &&
                  stop.settlement &&
                  ` - ${stop.settlement}`}
              </li>
            ))}
          </ul>
        </section>
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
