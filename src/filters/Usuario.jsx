import { createContext, useEffect } from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import links from "../links";
import apiSFE from "../service/api";

export const UsuarioContext = createContext({
  mudarPapelAtual: (novoPapel) => {},
  id_usuario: undefined,
  token: undefined,
  nome: undefined,
  papel_atual: undefined,
  login: undefined,
  regrasHabilidades: {},
  tipo: undefined,
  papeis: [],
});
export const tiposUsuario = {
  aluno: "ALUNO",
  coordenador: "COORDENADOR",
  preceptor: "PRECEPTOR",
};

export default function FiltroUsuario(props) {
  const [infoUsuario, setInfoUsuario] = useState(userModel({}));
  const [esperandoDados, setEsperandoDados] = useState(true);
  const [recarregar, setRecarregar] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    apiSFE
      .infoUsuario(token)
      .then((res) => {
        const usuario = res.data;
        setInfoUsuario(
          userModel({
            token,
            id_usuario: usuario.id_usuario,
            nome: usuario.nome,
            papel_atual: usuario.papel_atual,
            login: usuario.login,
            regrasHabilidades: usuario.regrasHabilidades,
            papeis: usuario.papeis,
            tipo: usuario.tipo,
          })
        );
        setEsperandoDados(false);
      })
      .catch((_) => {
        setInfoUsuario({});
        setEsperandoDados(false);
      });
  }, [recarregar]);

  async function mudarPapelAtual(novoPapel) {
    if (!infoUsuario.info.papeis.includes(novoPapel.valor))
      throw new Error(
        "O papel '" + novoPapel.valor + "' não é um papel válido"
      );
    try {
      const res = await apiSFE.editarUsuario(infoUsuario.token, {
        papel_atual: novoPapel.valor,
        id_usuario: infoUsuario.info.id_usuario,
      });

      localStorage.setItem("token", res.data);
      setRecarregar(!recarregar);

      return "Papel atual mudado com sucesso";
    } catch (err) {
      throw err;
    }
  }

  return (
    <UsuarioContext.Provider
      value={{
        mudarPapelAtual: mudarPapelAtual,
        id_usuario: infoUsuario.info?.id_usuario,
        token: infoUsuario.token,
        nome: infoUsuario.info?.nome,
        papel_atual: infoUsuario.info?.papel_atual,
        login: infoUsuario.info?.login,
        regrasHabilidades: infoUsuario.info?.regrasHabilidades,
        tipo: infoUsuario.info?.tipo,
        papeis: infoUsuario.info?.papeis,
      }}
    >
      {esperandoDados ? (
        <div>Redirecionando...</div>
      ) : infoUsuario.info?.id_usuario === undefined ? (
        <Navigate to={links.login} />
      ) : (
        props.children
      )}
    </UsuarioContext.Provider>
  );
}

function userModel({
  token,
  id_usuario,
  login,
  nome,
  papeis,
  papel_atual,
  regrasHabilidades,
  tipo,
}) {
  return {
    token: token,
    info: {
      id_usuario,
      login,
      nome,
      papeis,
      papel_atual,
      regrasHabilidades,
      tipo,
    },
  };
}
