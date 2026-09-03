import { useState } from "react";
import { feedbackUrl, missingScheduleUrl } from "../../config/contact";
import type {
  OfficialRouteDeparturePoint,
  OfficialRouteScheduleStatus,
  OfficialRouteTravelTimePoint,
} from "../../types/officialRoute";
import DeparturePoint from "./DeparturePoint";
import styles from "./ScheduleDirection.module.css";
import TravelTimeSection from "./TravelTimeSection";

type ScheduleDirectionProps = {
  from: string;
  to: string;
  departures: string[];
  scheduleId: string;
  status?: OfficialRouteScheduleStatus;
  departurePoint?: OfficialRouteDeparturePoint;
  travelTimePoints?: OfficialRouteTravelTimePoint[];
  note?: string;
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
  status = "available",
  departurePoint,
  travelTimePoints,
  note,
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

  if (status === "unavailable") {
    return (
      <div className={styles.scheduleDirection}>
        <h3 className={styles.directionTitle}>
          {from} → {to}
        </h3>
        {departurePoint && <DeparturePoint point={departurePoint} />}
        <div className={styles.unavailableSchedule}>
          <strong>Актуального расписания пока нет</strong>
          <p>Пока не удалось найти источник, которому можно доверять.</p>
          <a href={missingScheduleUrl} target="_blank" rel="noreferrer">
            Знаете актуальное расписание или источник? Сообщите нам
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.scheduleDirection}>
      <h3 className={styles.directionTitle}>
        {from} → {to}
      </h3>
      {departurePoint && <DeparturePoint point={departurePoint} />}
      {travelTimePoints && <TravelTimeSection points={travelTimePoints} />}

      {status === "estimated" && (
        <div className={styles.estimatedSchedule}>
          <strong>Ориентировочное расписание</strong>
          <p>По информации пассажиров. Фактическое время может отличаться.</p>
          {note && <p>{note}</p>}
          <a href={feedbackUrl} target="_blank" rel="noreferrer">
            Нашли неточность? Напишите нам
          </a>
        </div>
      )}

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
