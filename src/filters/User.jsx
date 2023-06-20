import { createContext, useEffect } from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import links from "../links";
import apiSFE from "../service/api";

export const UsuarioContext = createContext();

export default function FilterUser(props) {
  const [infoUsuario, setInfoUsuario] = useState(userModel({}));
  const [esperandoDados, setEsperandoDados] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    apiSFE
      .infoUsuario(token)
      .then((res) => {
        const usuario = res.data;
        setInfoUsuario(
          userModel({
            token,
            id: usuario.id,
            nome: usuario.nome,
            papel: usuario.papel,
            login: usuario.login,
            regrasHabilidades: usuario.regrasHabilidades,
          })
        );
        setEsperandoDados(false);
      })
      .catch((_) => {
        setInfoUsuario({});
        setEsperandoDados(false);
      });
  }, []);

  return (
    <UsuarioContext.Provider
      value={{
        setInfoUser: setInfoUsuario,
        id: infoUsuario.info?.id,
        token: infoUsuario.token,
        nome: infoUsuario.info?.nome,
        papel: infoUsuario.info?.papel,
        login: infoUsuario.info?.login,
        regrasHabilidades: infoUsuario.info?.regrasHabilidades,
      }}
    >
      {esperandoDados ? (
        <div>Redirecionando...</div>
      ) : infoUsuario.info?.papel === undefined ? (
        <Navigate to={links.login} />
      ) : (
        props.children
      )}
    </UsuarioContext.Provider>
  );
}

function userModel({ token, papel, nome, login, id, regrasHabilidades }) {
  return {
    token: token,
    info: {
      id,
      papel,
      nome,
      login,
      regrasHabilidades,
    },
  };
}
