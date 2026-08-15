import { Analytics } from "@vercel/analytics/react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import CatalogPage from "./pages/CatalogPage/CatalogPage";
import RoutePage from "./pages/RoutePage/RoutePage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/routes/:slug" element={<RoutePage />} />
      </Routes>
      <Analytics />
    </>
  );
}

export default App;
