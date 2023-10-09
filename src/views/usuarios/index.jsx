import CardLinks from "../../componentes/cards/CardLinks";
import { Outlet } from "react-router-dom";
import links from "../../links";
import Alunos from "./alunos/Alunos";
import Preceptores from "./preceptores/Preceptores";
import Coordenadores from "./coordenadores/Coordenadores";

const navsUsuario = [
  { valor: links.coordenadores, texto: "Coordenadores" },
  { valor: links.preceptores, texto: "Preceptores/Professores" },
  { valor: links.alunos, texto: "Alunos" },
];

export default function Usuarios() {
  return (
    <CardLinks navs={navsUsuario}>
      <Outlet />
    </CardLinks>
  );
}

export { Alunos, Preceptores, Coordenadores };
