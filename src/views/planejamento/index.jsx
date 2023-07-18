import Estagios from "./estagios/Estagios";
import Grupos from "./grupos/Grupos";
import Atividades from "./atividades/Atividades";
import { CardLinks } from "../../componentes";
import links from "../../links";
import { Outlet } from "react-router-dom";

const navsPlanejamento = [
  { valor: links.grupos, texto: "Grupos" },
  { valor: links.estagios, texto: "Estágios" },
  { valor: links.atividades, texto: "Atividades" },
];

export default function Planejamento() {
  return (
    <CardLinks navs={navsPlanejamento}>
      <Outlet />
    </CardLinks>
  );
}

export { Estagios, Grupos, Atividades };
