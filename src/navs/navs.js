import { FaUsers } from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { IoIosCreate } from "react-icons/io";
import { FaMapMarkedAlt } from "react-icons/fa";
import {
  BsFillCalendarWeekFill,
  BsFileEarmarkSpreadsheetFill,
} from "react-icons/bs";
import links from "../links";

const common = [
  {
    path: links.cronograma,
    name: "Cronograma",
    icon: <BsFillCalendarWeekFill size={18} />,
  },
  {
    path: links.conta,
    name: "Minha Conta",
    icon: <MdManageAccounts size={18} />,
  },
];

const adminPreceptorCoordenador = [
  { path: links.usuarios, name: "Usuarios", icon: <FaUsers size={18} /> },
  { path: links.locais, name: "Locais", icon: <FaMapMarkedAlt size={18} /> },
  {
    path: links.planejamento,
    name: "Planejamento",
    icon: <IoIosCreate size={18} />,
  },
  {
    path: links.relatorio,
    name: "Relatório",
    icon: <BsFileEarmarkSpreadsheetFill size={18} />,
  },
];

const navs = {
  aluno: common,
  adminPreceptorCoordenador: adminPreceptorCoordenador.concat(common),
};

export default navs;
