import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import links from "../links";
import apiSFE from "../service/api";
import { Spinner } from "react-bootstrap";
import { errors } from "../utils";
import { SistemaContext } from "../contexts";
import "./views.css";

export default function Login(props) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();
  const { error } = useContext(SistemaContext);

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
    setCarregando(true);
    await apiSFE
      .login(login, password)
      .then((res) => {
        localStorage.setItem("token", res.data);
        navigate(links.sistemaFrequencia);
      })
      .catch((err) => error(errors.filtraMensagem(err)))
      .finally(() => setCarregando(false));
  }

  return (
    <div className="d-flex bg-light justify-content-center align-items-center dimensoes-tela">
      <div className="card card-login">
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
              {carregando && (
                <Spinner animation="grow" className="me-2" size="sm" />
              )}
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
