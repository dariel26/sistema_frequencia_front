import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import links from "../links";
import Home from "../views/Home";
import Login from "../views/Login";
import Usuarios, {
  Coordenadores,
  Preceptores,
  Alunos,
} from "../views/usuarios";
import MyAccount from "../views/MyAccount";
import Planejamento, {
  Grupos,
  Atividades,
  Estagios,
} from "../views/planejamento";
import Local from "../views/Local";
import Cronograma from "../views/Cronograma/Cronograma";
import Relatorio from "../views/Relatorio";
import FiltroUsuario from "../filters/Usuario";
import Presencas from "../views/presenca/Presencas";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={links.sistemaFrequencia} />} />
        <Route path={links.login} element={<Login />} />
        <Route
          path={links.sistemaFrequencia}
          element={
            <FiltroUsuario>
              <Home />
            </FiltroUsuario>
          }
        >
          <Route path={links.usuarios} element={<Usuarios />}>
            <Route path={links.coordenadores} element={<Coordenadores />} />
            <Route path={links.preceptores} element={<Preceptores />} />
            <Route path={links.alunos} element={<Alunos />} />
            <Route index element={<Navigate to={links.coordenadores} />} />
          </Route>

          <Route path={links.presencas} element={<Presencas />} />

          <Route path={links.planejamento} element={<Planejamento />}>
            <Route path={links.grupos} element={<Grupos />} />
            <Route path={links.estagios} element={<Estagios />} />
            <Route path={links.atividades} element={<Atividades />} />
            <Route index element={<Navigate to={links.grupos} />} />
          </Route>

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
