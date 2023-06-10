import { FaUsers } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { SlOrganization } from "react-icons/sl"
import links from "../links";

const common = [
  {
    path: links.conta,
    name: "Minha Conta",
    icon: <MdManageAccounts size={18} />,
  },
];

const navs = {
  preceptor: [].concat(common),
  aluno: [].concat(common),
  coordenador: [].concat(common),
  admin: [
    { path: links.usuarios, name: "Usuarios", icon: <FaUsers size={18} /> },
    { path: links.planejamento, name: "Planejamento", icon: <SlOrganization size={18} /> },
  ].concat(common),
};

export default navs;
