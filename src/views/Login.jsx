import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertContext } from "../filters/alert/Alert";
import links from "../links";
import apiSFE from "../service/api";

export default function Login(props) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const alert = useContext(AlertContext);

  function onChangeLogin(e) {
    e.preventDefault();
    setLogin(e.target.value);
  }

  function onChangePass(e) {
    e.preventDefault();
    setPassword(e.target.value);
  }

  async function enter(e) {
    e.preventDefault();
    await apiSFE
      .login(login, password)
      .then((res) => {
        localStorage.setItem("token", res.data);
        navigate(links.sistemaFrequencia);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data?.credenciaisEstado === false) {
          //passar estas verificações para o Alert.jsx
          alert.addAlert({
            title: "Credenciais inválidas",
            message: "E-mail ou senha inválidos",
            time: 3000,
            danger: true,
          });
        } else {
          alert.addAlert({
            title: "Ops",
            message: "Parace que algo deu errado, tente denovo mais tarde",
            time: 8000,
            danger: true,
          });
        }
      });
  }

  return (
    <div
      className="d-flex bg-light justify-content-center align-items-center"
      style={{ height: "100vh", width: "100vw" }}
    >
      <div className="card" style={{ width: "18rem", height: "18rem" }}>
        <div className="card-body">
          <h5 className="card-title">Faça Login</h5>
          <form>
            <div className="mb-3">
              <label className="form-label">E-mail / Matricula</label>
              <input
                type="email"
                className="form-control"
                autoComplete="username"
                aria-describedby="emailHelp"
                value={login}
                onChange={onChangeLogin}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Senha</label>
              <input
                type="password"
                className="form-control"
                autoComplete="current-password"
                value={password}
                onChange={onChangePass}
              />
            </div>
            <button type="submit" className="btn btn-primary" onClick={enter}>
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
