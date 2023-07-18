import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { useContext } from "react";
import CardDefault from "../components/cards/CardDefault";
import { AlertaContext } from "../filters/alerta/Alerta";
import { UsuarioContext } from "../filters/Usuario";
import apiSFE from "../service/api";

export default function MyAccount() {
  const [defaultUser, setDefaultUser] = useState(false);
  const [senha, setSenha] = useState("");
  const [senhaConfirmada, setSenhaConfirmada] = useState("");
  const [estado, setEstado] = useState(0);

  const usuario = useContext(UsuarioContext);
  const alert = useRef(useContext(AlertaContext));

  const arrInfoUsuario = Object.entries(usuario).filter(([campo]) => {
    return campo === "nome" || campo === "login" || campo === "papel";
  });

  useEffect(() => {
    if (usuario.login === undefined) return;
    if (usuario.token === undefined) return;
    apiSFE
      .usuarioPadrao(usuario.token)
      .then((res) => {
        setDefaultUser(res.data.padrao);
      })
      .catch((err) => {
        alert.current.addAlert(err);
      });
  }, [usuario, estado]);

  const onSubmit = (e) => {
    e.preventDefault();
    const token = usuario.token;
    if (senha !== senhaConfirmada) {
      alert.current.addAlert(new Error("As senhas devem ser corresponder"));
    } else if (senha.length < 3) {
      alert.current.addAlert(
        new Error("A senha deve conter no mínimo 3 carateres")
      );
    } else {
      const novosDados = [{ id: usuario.id, senha }];
      apiSFE
        .mudarSenha(token, novosDados)
        .then(() => {
          alert.current.addAlert(undefined, "Senha modificada!");
          setEstado((estado) => estado + 1);
        })
        .catch((err) => {
          alert.current.addAlert(err);
        });
    }
  };

  return (
    <CardDefault title="Minha Conta">
      <div className="row justify-content-center">
        {arrInfoUsuario?.map((info, i) => {
          const title =
            info[0] === "nome"
              ? "Nome"
              : info[0] === "email"
              ? "E-mail"
              : info[0] === "papel"
              ? "Papel"
              : "Login";
          const value = info[1];
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
          <form className="d-flex flex-column" style={{ maxWidth: "300px" }}>
            <div className="mb-3">
              <label htmlFor="password1" className="form-label">
                Senha
              </label>
              <input
                type="password"
                autoComplete="new-password"
                className="form-control"
                id="password1"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);
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
                value={senhaConfirmada}
                onChange={(e) => {
                  setSenhaConfirmada(e.target.value);
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              onClick={onSubmit}
            >
              Mudar
            </button>
          </form>
        ) : undefined}
      </div>
    </CardDefault>
  );
}
