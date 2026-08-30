import type { OfficialRouteDeparturePoint } from "../../types/officialRoute";
import styles from "./OfficialRouteCard.module.css";

type DeparturePointProps = {
  point: OfficialRouteDeparturePoint;
};

const DeparturePoint = ({ point }: DeparturePointProps) => (
  <div className={styles.departurePoint}>
    <p className={styles.departurePointLabel}>Место отправления</p>
    <strong>{point.name}</strong>
    {point.address && <span>{point.address}</span>}
    {point.mapUrl && (
      <a href={point.mapUrl} target="_blank" rel="noreferrer">
        Показать на карте
      </a>
    )}
  </div>
);

export default DeparturePoint;
