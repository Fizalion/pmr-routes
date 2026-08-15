import { Link, useParams } from "react-router-dom";
import OfficialRouteCard from "../../components/OfficialRouteCard/OfficialRouteCard";
import { officialRoutes } from "../../data/officialRoutes";

const RoutePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const route = officialRoutes.find((route) => route.slug === slug);

  if (!route)
    return (
      <main className="app route-page">
        <Link className="route-back-link" to="/">
          ← Все маршруты
        </Link>
        <h1>Маршрут не найден.</h1>
      </main>
    );

  return (
    <main className="app route-page">
      <Link className="route-back-link" to="/">
        ← Все маршруты
      </Link>
      <OfficialRouteCard route={route} />
    </main>
  );
};

export default RoutePage;
