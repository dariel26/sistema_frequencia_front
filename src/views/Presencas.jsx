import { useContext, useEffect } from "react";
import { CardSimples } from "../componentes";
import { UsuarioContext } from "../filters/Usuario";
import apiSFE from "../service/api";

export default function Presencas() {
  const usuario = useContext(UsuarioContext);
  const token = usuario.token;

  useEffect(() => {
    apiSFE.listarAtividades(token).then((res) => {
      console.log(res.data);
    });
  }, [token]);
  return <CardSimples titulo={"Presenças"} />;
}
