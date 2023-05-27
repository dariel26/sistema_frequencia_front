import { FaUsers } from "react-icons/fa";
import links from "../links";

const navs = {
    preceptor: [],
    aluno: [],
    coordenador: [],
    admin: [
        { path: links.usuarios, name: "Usuarios", icon: <FaUsers size={18} /> }
    ]
}

export default navs;