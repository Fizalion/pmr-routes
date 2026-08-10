import { Analytics } from "@vercel/analytics/react";
import { useState } from "react";
import "./App.css";
import OfficialRouteCard from "./components/OfficialRouteCard/OfficialRouteCard";
import RouteList from "./components/RouteList/RouteList";
import route075Data from "./data/route-075.json";
import route076Data from "./data/route-076.json";
import transportJson from "./data/transport.json";
import type { TransportData } from "./types/transport";

const transportData: TransportData = transportJson as TransportData;
const currentCity = transportData.cities[0];
const tiraspolRoutes = transportData.routes.filter(
  (route) => route.cityId === currentCity?.id,
);

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredRoutes = tiraspolRoutes.filter(
    (route) =>
      route.number.includes(normalizedSearchQuery) ||
      route.name.toLowerCase().includes(normalizedSearchQuery),
  );

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <main className="app">
      <header className="app-header">
        <h1>Маршрутки ПМР</h1>
        <p>{currentCity?.name ?? "Неизвестный город"}</p>
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

      <section className="route-section verified-routes-section">
        <h2 className="route-section-title">Проверенные маршруты</h2>
        <p className="route-section-description">
          Расписание и остановки проверены по официальным источникам.
        </p>
        <OfficialRouteCard route={route075Data} />
        <OfficialRouteCard route={route076Data} />
      </section>

      <section className="route-section demo-routes-section">
        <h2 className="route-section-title">Демо-маршруты</h2>
        <p className="route-section-description">
          Данные этих маршрутов ещё проверяются.
        </p>

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

        <RouteList
          routes={filteredRoutes}
          cityName={currentCity?.name ?? "Неизвестный город"}
        ></RouteList>
      </section>

      <Analytics />
    </main>
  );
}

export default App;
