import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { useContext } from "react";
import { AlertaContext } from "../filters/alerta/Alerta";
import { UsuarioContext, tiposUsuario } from "../filters/Usuario";
import apiSFE from "../service/api";
import { CardSimples, InputSelecao } from "../componentes";
import { Col, Row } from "react-bootstrap";
import { SistemaContext } from "../filters/sistema/Sistema";

export default function MinhaConta() {
  const [senhaPadrao, setSenhaPadrao] = useState(false);
  const [senha, setSenha] = useState("");
  const [senhaConfirmada, setSenhaConfirmada] = useState("");

  const { carregando } = useRef(useContext(SistemaContext)).current;
  const usuario = useContext(UsuarioContext);
  const alert = useRef(useContext(AlertaContext));

  useEffect(() => {
    carregando(true);
    if (usuario.login === undefined) return;
    if (usuario.token === undefined) return;
    apiSFE
      .usuarioPadrao(usuario.token)
      .then((res) => {
        setSenhaPadrao(res.data.padrao);
      })
      .catch((err) => {
        alert.current.addAlert(err);
      })
      .finally(() => carregando(false));
  }, [usuario, carregando]);

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
          setSenhaPadrao(false);
        })
        .catch((err) => {
          alert.current.addAlert(err);
        });
    }
  };

  return (
    <CardSimples titulo="Minha Conta">
      <Row className="justify-content-center m-0">
        <Col sm="4" className="mb-3">
          <h6>Nome:</h6>
          <span>{usuario.nome}</span>
        </Col>
        <Col sm="4" className="mb-3">
          <h6>Login:</h6>
          <span>{usuario.login}</span>
        </Col>
        <Col sm="4" className="mb-3">
          <h6>Papel Atual</h6>
          {usuario.tipo === tiposUsuario.coordenador ? (
            <InputSelecao
              campoSelecao={"valor"}
              textoReferencia="Papel do usuário"
              opcoesSelecao={usuario.papeis.map((p) => ({ valor: p }))}
              textoBotao="Mudar"
              aoSubmeter={usuario.mudarPapelAtual}
              textoInicial={usuario.papel_atual}
            />
          ) : (
            <span>{usuario.papel_atual}</span>
          )}
        </Col>
        {senhaPadrao ? (
          <h5 className="text-danger text-center">
            Parece que sua conta está com uma senha padrão, por segurança mude
            sua senha
          </h5>
        ) : undefined}
        <hr />
        {senhaPadrao ? (
          <form className="d-flex flex-column" style={{ maxWidth: "300px" }}>
            <div className="mb-3">
              <label htmlFor="password1" className="form-label">
                Nova senha
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
                Confirmar nova senha
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
      </Row>
    </CardSimples>
  );
}
