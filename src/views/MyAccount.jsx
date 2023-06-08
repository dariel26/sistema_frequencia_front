import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useContext } from "react";
import CardDefault from "../components/cards/CardDefault";
import { AlertContext } from "../filters/alert/Alert";
import { UserContext } from "../filters/User";
import apiSFE from "../service/api";

export default function MyAccount() {
  const [defaultUser, setDefaultUser] = useState(false);
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const user = useContext(UserContext);
  const alert = useContext(AlertContext);

  const mapInfoUser = user.infoUser.info;
  delete mapInfoUser.regrasHabilidades;
  const arrInfoUser = Object.entries(mapInfoUser);

  const addAlert = useCallback(
    (err, message) => {
      alert.addAlert(err, message);
    },
    [alert]
  );

  useEffect(() => {
    if (
      user.infoUser.info.email === undefined &&
      user.infoUser.info.matricula === undefined
    )
      return;

    const email = user.infoUser.info.email;
    const matricula = user.infoUser.info.matricula;

    apiSFE
      .usuarioPadrao(user.infoUser.token, {
        login: email !== undefined ? email : matricula,
        senha: email !== undefined ? email : matricula,
      })
      .then((res) => {
        setDefaultUser(res.data);
      })
      .catch((err) => {
        addAlert(err);
      });
  }, [user, addAlert]);

  const onSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if(pass !== confirmPass){
      addAlert(new Error("Senhas diferentes"))
    } else if(pass.length < 5){
      addAlert(new Error("Senha deve conter no mínimo 5 carateres"))
    }else {
      console.log(pass);
      apiSFE.mudarSenha(token, pass).then(() => {
        addAlert(undefined, "Senha modificada");
        setDefaultUser(false);
      })
      .catch((err) => {
        addAlert(err);
      })
    } 
  }

  return (
    <CardDefault title="Minha Conta">
      <div className="row justify-content-center">
        {arrInfoUser?.map((arrInfo, i) => {
          const title =
            arrInfo[0] === "nome"
              ? "Nome"
              : arrInfo[0] === "email"
              ? "E-mail"
              : arrInfo[0] === "papel"
              ? "Papel"
              : "Matricula";
          const value = arrInfo[1];
          return value === undefined ? undefined : (
            <div className="mb-3 col-sm-4" key={i}>
              <h6>{title}:</h6>
              <p className="ps-2">{value}</p>
            </div>
          );
        })}
        {defaultUser ? (
          <h5 className="text-danger text-center">
            Parece que sua conta está com uma senha padrão, por segurança mude
            sua senha
          </h5>
        ) : undefined}
        <hr />
        {defaultUser ? (
          <form className="d-flex flex-column" style={{maxWidth: "300px"}}>
            <div className="mb-3">
              <label htmlFor="password1" className="form-label">
                Senha
              </label>
              <input
                type="password"
                autoComplete="new-password"
                className="form-control"
                id="password1"
                value={pass}
                onChange={(e) => {
                  setPass(e.target.value);
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password2" className="form-label">
                Confirmar Senha
              </label>
              <input
                type="password"
                autoComplete="new-password"
                className="form-control"
                id="password2"
                value={confirmPass}
                onChange={(e) => {
                  setConfirmPass(e.target.value);
                }}
              />
            </div>

            <button type="submit" className="btn btn-primary" onClick={onSubmit}>
              Mudar
            </button>
          </form>
        ) : undefined}
      </div>
    </CardDefault>
  );
}
