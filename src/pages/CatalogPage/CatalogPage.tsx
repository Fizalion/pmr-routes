import { useState } from "react";
import { Link } from "react-router-dom";
import OfficialRouteCard from "../../components/OfficialRouteCard/OfficialRouteCard";
import RouteList from "../../components/RouteList/RouteList";
import { officialRoutes } from "../../data/officialRoutes";
import transportJson from "../../data/transport.json";
import type { RouteStatus } from "../../types/route";
import type { TransportData } from "../../types/transport";

type RouteFilter = RouteStatus | "all";

const transportData: TransportData = transportJson as TransportData;
const currentCity = transportData.cities[0];
const tiraspolRoutes = transportData.routes.filter(
  (route) => route.cityId === currentCity?.id,
);

function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [routeFilter, setRouteFilter] = useState<RouteFilter>("active");

  const showActiveRoutes = routeFilter === "all" || routeFilter === "active";
  const showDemoRoutes = routeFilter === "demo" || routeFilter === "all";
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const filteredDemoRoutes = tiraspolRoutes.filter(
    (route) =>
      route.number.includes(normalizedSearchQuery) ||
      route.name.toLowerCase().includes(normalizedSearchQuery) ||
      route.direction.from.toLowerCase().includes(normalizedSearchQuery) ||
      route.direction.to.toLowerCase().includes(normalizedSearchQuery),
  );

  const filteredOfficialRoutes = officialRoutes.filter(
    (route) =>
      route.officialNumber.includes(normalizedSearchQuery) ||
      route.name.toLowerCase().includes(normalizedSearchQuery) ||
      route.directions.forward.from
        .toLowerCase()
        .includes(normalizedSearchQuery) ||
      route.directions.forward.to.toLowerCase().includes(normalizedSearchQuery),
  );

  const hasVisibleRoutes =
    (showActiveRoutes && filteredOfficialRoutes.length > 0) ||
    (showDemoRoutes && filteredDemoRoutes.length > 0);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <main className="app">
      <header className="app-header">
        <h1>Маршрутки ПМР</h1>
      </header>

      <aside className="prototype-notice">
        <p>
          ⚠️ Это прототип. Данные могут быть неполными или неточными. Сейчас
          проверяю источники и постепенно уточняю данные.
        </p>
        <a
          href="https://t.me/fizaliondev/118"
          target="_blank"
          rel="noopener noreferrer"
        >
          Нашли неточность? Сообщить в Telegram
        </a>
      </aside>

      <div className="search-controls">
        <label className="search-label" htmlFor="search-input">
          Поиск маршрута
        </label>
        <input
          id="search-input"
          className="search-input"
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Номер маршрута или направление"
          value={searchQuery}
        />

        {searchQuery && (
          <button
            className="clear-search-button"
            type="button"
            onClick={handleClearSearch}
          >
            Очистить поиск
          </button>
        )}
      </div>

      <nav className="route-filter" aria-label="Фильтр маршрутов">
        <button
          className="route-filter-button"
          aria-pressed={routeFilter === "active"}
          type="button"
          onClick={() => setRouteFilter("active")}
        >
          Актуальные
        </button>
        <button
          className="route-filter-button"
          aria-pressed={routeFilter === "demo"}
          type="button"
          onClick={() => setRouteFilter("demo")}
        >
          Демо
        </button>
        <button
          className="route-filter-button"
          aria-pressed={routeFilter === "all"}
          type="button"
          onClick={() => setRouteFilter("all")}
        >
          Все
        </button>
      </nav>

      {normalizedSearchQuery.length > 0 && !hasVisibleRoutes && (
        <p className="search-empty-message">
          По вашему запросу маршруты не найдены.
        </p>
      )}

      {showActiveRoutes && filteredOfficialRoutes.length > 0 && (
        <section className="route-section verified-routes-section">
          <h2 className="route-section-title">Проверенные маршруты</h2>
          <p className="route-section-description">
            Расписание и остановки проверены по официальным источникам.
          </p>
          {filteredOfficialRoutes.map((route) => (
            <div key={route.id} className="official-route-list-item">
              <OfficialRouteCard route={route} showStops={false} />
              <Link className="route-details-link" to={`/routes/${route.slug}`}>
                Открыть маршрут
              </Link>
            </div>
          ))}
        </section>
      )}

      {showDemoRoutes && filteredDemoRoutes.length > 0 && (
        <section className="route-section demo-routes-section">
          <h2 className="route-section-title">Демо-маршруты</h2>
          <p className="route-section-description">
            Данные этих маршрутов ещё проверяются.
          </p>

          <RouteList
            routes={filteredDemoRoutes}
            cityName={currentCity?.name ?? "Неизвестный город"}
          />
        </section>
      )}
    </main>
  );
}

export default CatalogPage;
