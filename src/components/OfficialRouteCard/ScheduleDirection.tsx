import { useState } from "react";
import styles from "./ScheduleDirection.module.css";

type ScheduleDirectionProps = {
  from: string;
  to: string;
  departures: string[];
  scheduleId: string;
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

const ScheduleDirection = ({
  from,
  to,
  departures,
  scheduleId,
}: ScheduleDirectionProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const currentTime = new Date();
  const currentTimeMinutes =
    currentTime.getHours() * 60 + currentTime.getMinutes();
  const upcomingDepartures = getUpcomingDepartures(
    departures,
    currentTimeMinutes,
  );

  const displayedDepartures = isExpanded ? departures : upcomingDepartures;

  return (
    <div className={styles.scheduleDirection}>
      <h3 className={styles.directionTitle}>
        {from} → {to}
      </h3>
      <p className={styles.nextDeparturesLabel}>
        {isExpanded ? "Полное расписание" : "Следующие рейсы"}
      </p>
      <div id={scheduleId}>
        {displayedDepartures.length > 0 ? (
          <ul className={styles.departureList}>
            {displayedDepartures.map((departure, index) => (
              <li
                className={styles.departureTime}
                key={scheduleId + "-" + departure + "-" + index}
              >
                {departure}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noDepartures}>
            Следующий рейс завтра в {departures[0]}.
          </p>
        )}
      </div>
      <button
        className={styles.scheduleButton}
        type="button"
        aria-controls={scheduleId}
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((isExpanded) => !isExpanded)}
      >
        {isExpanded ? "Скрыть полное расписание" : "Показать всё расписание"}
      </button>
    </div>
  );
};

export default ScheduleDirection;
