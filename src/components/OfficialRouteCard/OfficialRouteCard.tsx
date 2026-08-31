import type { OfficialRoute } from "../../types/officialRoute";
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
  const forwardScheduleId = route.id + "-forward-schedule";
  const backwardScheduleId = route.id + "-backward-schedule";
  const stops = route.stops;
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
            travelTimePoints={route.directions.forward.travelTimePoints}
          />

          <ScheduleDirection
            from={route.directions.backward.from}
            to={route.directions.backward.to}
            departures={route.schedule.backwardDepartures}
            scheduleId={backwardScheduleId}
            status={route.schedule.backwardStatus}
            departurePoint={route.directions.backward.departurePoint}
            travelTimePoints={route.directions.backward.travelTimePoints}
          />
        </div>
      </section>

      {showStops && stops.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Остановки</h2>
          <ul className={styles.stopList}>
            {stops.map((stop) => (
              <li className={styles.stopItem} key={stop.id}>
                {stop.name}
                {stop.settlement && ` - ${stop.settlement}`}
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
