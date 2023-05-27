import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import links from "../links";
import Home from "../views/Home";
import Login from "../views/Login";
import Users from "../views/Users";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={links.sistemaFrequencia} />} />
        <Route path={links.login} element={<Login />} />
        <Route path={links.sistemaFrequencia} element={<Home />}>
          <Route path={links.usuarios} element={<Users />} />
          <Route index element={<Navigate to={links.usuarios} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
