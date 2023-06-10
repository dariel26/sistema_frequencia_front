import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import links from "../links";
import Home from "../views/Home";
import Login from "../views/Login";
import Users from "../views/Users";
import MyAccount from "../views/MyAccount";
import Organization from "../views/Organization/Organization";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={links.sistemaFrequencia} />} />
        <Route path={links.login} element={<Login />} />
        <Route path={links.sistemaFrequencia} element={<Home />}>
          <Route path={links.usuarios} element={<Users />} />
          <Route path={links.planejamento} element={<Organization />} />
          <Route path={links.conta} element={<MyAccount />} />
          <Route index element={<Navigate to={links.usuarios} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
