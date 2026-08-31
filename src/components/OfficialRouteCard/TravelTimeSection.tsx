import type { OfficialRouteTravelTimePoint } from "../../types/officialRoute";
import { feedbackUrl } from "../../config/contact";
import styles from "./ScheduleDirection.module.css";

type TravelTimeSectionProps = {
  points: OfficialRouteTravelTimePoint[];
};

const TravelTimeSection = ({ points }: TravelTimeSectionProps) => {
  const referencePoint = points.find((point) => point.isReference);
  const travelPoints = points.filter((point) => !point.isReference);

  if (!referencePoint) return null;

  return (
    <section className={styles.travelTimeSection}>
      <h4>Примерное время на подтверждённом участке</h4>
      <p>Отсчёт от: <strong>{referencePoint.name}</strong></p>
      <ul>
        {travelPoints.map((point) => (
          <li key={point.id}>
            <strong>{point.name}</strong>
            <span>через {point.minMinutes}–{point.maxMinutes} минут</span>
            <small>по {point.sampleSize} поездкам</small>
          </li>
        ))}
      </ul>
      <p>Диапазоны рассчитаны по GPS-трекам поездок. Фактическое время может отличаться из-за остановок и дорожной ситуации.</p>
      <a className={styles.travelTimeCta} href={feedbackUrl} target="_blank" rel="noreferrer">
        Ездите этим маршрутом? Помогите уточнить время
      </a>
    </section>
  );
};

export default TravelTimeSection;
