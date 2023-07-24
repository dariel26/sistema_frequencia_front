import MenuLayout from "../layouts/menu/MenuLayout";
import navs from "../navs/navs";
import { UsuarioContext } from "../filters/Usuario";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

export default function Home() {
  const navigate = useNavigate();
  const usuario = useContext(UsuarioContext);

  const usuarioAluno = usuario?.papel === "ALUNO(A)";
  return (
    <MenuLayout
      navs={usuarioAluno ? navs.aluno : navs.adminPreceptorCoordenador}
      actions={[
        {
          onClick: () => {
            localStorage.removeItem("token");
            navigate("/login");
          },
          name: "Sair",
          icon: <FiLogOut size={18} />,
        },
      ]}
    />
  );
}
