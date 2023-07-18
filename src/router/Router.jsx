import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import links from "../links";
import Home from "../views/Home";
import Login from "../views/Login";
import Usuarios from "../views/usuarios/Usuarios";
import MyAccount from "../views/MyAccount";
import Organization from "../views/Planejamento";
import Local from "../views/Local";
import Cronograma from "../views/Cronograma/Cronograma";
import Relatorio from "../views/Relatorio";
import { Coordenadores } from "../views/usuarios/coordenadores/Coordenadores";
import { Alunos } from "../views/usuarios/alunos/Alunos";
import { Preceptores } from "../views/usuarios/preceptores/Preceptores";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={links.sistemaFrequencia} />} />
        <Route path={links.login} element={<Login />} />
        <Route path={links.sistemaFrequencia} element={<Home />}>
          <Route path={links.usuarios} element={<Usuarios />}>
            <Route path={links.coordenadores} element={<Coordenadores />} />
            <Route path={links.preceptores} element={<Preceptores />} />
            <Route path={links.alunos} element={<Alunos />} />
            <Route index element={<Navigate to={links.coordenadores} />} />
          </Route>
          <Route path={links.planejamento} element={<Organization />} />
          <Route path={links.conta} element={<MyAccount />} />
          <Route path={links.locais} element={<Local />} />
          <Route path={links.cronograma} element={<Cronograma />} />
          <Route path={links.relatorio} element={<Relatorio />} />
          <Route index element={<Navigate to={links.conta} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
