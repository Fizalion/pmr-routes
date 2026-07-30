import { useState } from "react";
import "./App.css";
import RouteList from "./components/RouteList/RouteList";
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
    </main>
  );
}

export default App;
