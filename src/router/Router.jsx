import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import links from "../links";
import Home from "../views/Home";
import Login from "../views/Login";
import Users from "../views/usuarios";
import MyAccount from "../views/MyAccount";
import Organization from "../views/Planejamento";
import Places from "../views/Places";
import Cronograma from "../views/Cronograma/Cronograma";

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
          <Route path={links.locais} element={<Places />} />
          <Route path={links.cronograma} element={<Cronograma />} />
          <Route index element={<Navigate to={links.conta} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
