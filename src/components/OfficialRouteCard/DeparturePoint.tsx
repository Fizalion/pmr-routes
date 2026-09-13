import type { OfficialRouteDeparturePoint } from "../../types/officialRoute";
import styles from "./OfficialRouteCard.module.css";

type DeparturePointProps = {
  point: OfficialRouteDeparturePoint;
  label?: string;
};

const DeparturePoint = ({
  point,
  label = "Место отправления",
}: DeparturePointProps) => (
  <div className={styles.departurePoint}>
    <p className={styles.departurePointLabel}>{label}</p>
    <strong>{point.name}</strong>
    {point.address && <span>{point.address}</span>}
    {point.phone && (
      <span>{point.phoneLabel ?? "Справочная"}: {point.phone}</span>
    )}
    {point.mapUrl && (
      <a href={point.mapUrl} target="_blank" rel="noreferrer">
        Показать на карте
      </a>
    )}
  </div>
);

export default DeparturePoint;
