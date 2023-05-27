import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import FiltroUser from "../filters/User";
import Login from "../views/Login";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={routes.sistemaFrequencia} />} />
        <Route path={routes.login} element={<Login />} />
        <Route
          path={routes.sistemaFrequencia}
          element={
            <FiltroUser>
              <div>Bem vindo ao sistema</div>
            </FiltroUser>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export const routes = {
  login: "/login",
  sistemaFrequencia: "/sistema-frequencia",
};
