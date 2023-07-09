import CardLinks from "../../componentes/cards/CardLinks";
import { Outlet } from "react-router-dom";
import links from "../../links";

const navsUsuario = [
  { valor: links.coordenadores, texto: "Coordenadores" },
  { valor: links.preceptores, texto: "Preceptores" },
  { valor: links.alunos, texto: "Alunos" },
];
export default function Usuarios() {
  return (
    <CardLinks navs={navsUsuario}>
      <Outlet />
    </CardLinks>
  );
}
