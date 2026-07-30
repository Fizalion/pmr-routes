import type { TransportRoute } from "../../types/transport";
import RouteCard from "../RouteCard/RouteCard";
import styles from "./RouteList.module.css";

type RouteListProps = {
  routes: TransportRoute[];
  cityName: string;
};

const RouteList = ({ routes, cityName }: RouteListProps) => {
  if (routes.length === 0)
    return (
      <section className={styles.section}>
        <h2 className={styles.title}>Маршруты {cityName}</h2>
        <p className={styles.empty} aria-live="polite">
          Маршруты не найдены
        </p>
      </section>
    );

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Маршруты {cityName}</h2>
      <p className={styles.count} aria-live="polite">
        Найдено: {routes.length}
      </p>
      <ul className={styles.list}>
        {routes.map((route) => (
          <li key={route.id}>
            <RouteCard route={route}></RouteCard>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RouteList;
