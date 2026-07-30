import { useState } from "react";
import type { TransportRoute } from "../../types/transport";
import styles from "./RouteCard.module.css";

type RouteCardProps = {
  route: TransportRoute;
};

const RouteCard = ({ route }: RouteCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const streetNames = route.routeStreets.circular
    ? route.routeStreets.circular
    : (route.routeStreets.forward ?? []);
  const backwardStreetNames = route.routeStreets.backward
    ? route.routeStreets.backward
    : [];
  const backwardDifferences = route.routeStreets.backwardDifferences
    ? route.routeStreets.backwardDifferences
    : [];
  const hasReturnRoute =
    backwardStreetNames.length > 0 || backwardDifferences.length > 0;
  const detailsId = "route-details-" + route.id;

  const handleToggleDetails = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <article className={styles.card}>
      <div className={styles.heading}>
        <span className={styles.routeBadge}>{route.number}</span>
        <div>
          <h3 className={styles.routeNumber}>Маршрут №{route.number}</h3>
          <p className={styles.serviceDays}>{route.schedule.daysLabel}</p>
        </div>
      </div>

      <div className={styles.endpoints}>
        <p>{route.direction.from}</p>
        <span aria-hidden="true">↓</span>
        <p>{route.direction.to}</p>
      </div>

      <dl className={styles.metadata}>
        <div>
          <dt>Стоимость</dt>
          <dd>{route.price.display}</dd>
        </div>
        <div>
          <dt>Интервал</dt>
          <dd>{route.schedule.intervalLabel}</dd>
        </div>
        <div>
          <dt>Первый рейс</dt>
          <dd>{route.schedule.firstDeparture}</dd>
        </div>
        <div>
          <dt>Последний рейс</dt>
          <dd>{route.schedule.lastDeparture}</dd>
        </div>
      </dl>
      <button
        className={styles.detailsButton}
        type="button"
        onClick={handleToggleDetails}
        aria-expanded={isExpanded}
        aria-controls={detailsId}
      >
        {isExpanded ? "Скрыть маршрут" : "Показать маршрут"}
      </button>

      {isExpanded === true && (
        <div className={styles.details} id={detailsId}>
          <div
            className={
              hasReturnRoute ? styles.directionGrid : styles.directionGridSingle
            }
          >
            <div className={styles.routeSection}>
              <h4 className={styles.detailsTitle}>
                {route.isCircular ? "Кольцевой маршрут" : "Туда"}
              </h4>
              <ol className={styles.streetList}>
                {streetNames.map((streetName, index) => (
                  <li
                    className={styles.streetItem}
                    key={route.id + "-forward-" + index}
                  >
                    {streetName}
                  </li>
                ))}
              </ol>
            </div>

            {backwardStreetNames.length > 0 && (
              <div className={styles.routeSection}>
                <h4 className={styles.detailsTitle}>Обратно</h4>
                <ol className={styles.streetList}>
                  {backwardStreetNames.map((streetName, index) => (
                    <li
                      className={styles.streetItem}
                      key={route.id + "-backward-" + index}
                    >
                      {streetName}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {backwardStreetNames.length === 0 &&
              backwardDifferences.length > 0 && (
                <div className={styles.routeSection}>
                  <h4 className={styles.detailsTitle}>Обратно: отличия</h4>
                  <ul className={styles.streetList}>
                    {backwardDifferences.map((streetName, index) => (
                      <li
                        className={styles.streetItem}
                        key={route.id + "-difference-" + index}
                      >
                        {streetName}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>

          {route.features && route.features.length > 0 && (
            <div className={styles.features}>
              <h4 className={styles.detailsTitle}>Особенности</h4>
              <ul className={styles.featureList}>
                {route.features.map((feature, index) => (
                  <li
                    className={styles.featureItem}
                    key={route.id + "-" + feature + "-" + index}
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </article>
  );
};

export default RouteCard;
