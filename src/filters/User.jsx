import { createContext, useEffect } from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { routes } from "../router/Router";
import apiSFE from "../service/api";

export const UserContext = createContext();

export default function FiltroUser(props) {
  const [infoUser, setInfoUser] = useState(userModel({}));
  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    apiSFE
      .infoUser(token)
      .then((res) => {
        const user = res.data;
        console.log(res.data);
        setInfoUser(
          userModel({
            token,
            papel: user.papel,
            nome: user.nome,
            email: user.email,
            matricula: user.matricula,
            regrasHabilidades: user.regrasHabilidades,
          })
        );
        setWaiting(false);
      })
      .catch((_) => {
        setInfoUser({});
        setWaiting(false);        
      });
  }, []);

  return (
    <UserContext.Provider value={{ infoUser, setInfoUser }}>
      {waiting ? (
        <div>Redirecionando...</div>
      ) : infoUser.info?.papel === undefined ? (
        <Navigate to={routes.login} />
      ) : (
        props.children
      )}
    </UserContext.Provider>
  );
}

function userModel({
  token,
  papel,
  nome,
  email,
  matricula,
  regrasHabilidades,
}) {
  return {
    token: token,
    info: {
      papel: papel,
      nome: nome,
      email: email,
      matricula: matricula,
      regrasHabilidades: regrasHabilidades,
    },
  };
}
