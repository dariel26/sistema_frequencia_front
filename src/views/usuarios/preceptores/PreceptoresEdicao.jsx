import { useContext, useRef, useState } from "react";
import { Button, Col, Form, Row, Spinner, ToggleButton } from "react-bootstrap";
import { SistemaContext } from "../../../contexts";
import { errors } from "../../../utils";

export default function PreceptoresEdicao({
  preceptor,
  aoSalvar,
  setPreceptorEmEdicao,
}) {
  const [nome, setNome] = useState(preceptor.nome);
  const [login, setLogin] = useState(preceptor.login);
  const [trocarSenha, setTrocarSenha] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const { error } = useRef(useContext(SistemaContext)).current;

  const houveMudanca =
    trocarSenha || nome !== preceptor.nome || login !== preceptor.login;

  function aoSalvarMudancas() {
    if (!houveMudanca) return;
    const novosDados = {
      id_usuario: preceptor.id_usuario,
      nome,
      login,
    };
    if (trocarSenha) novosDados.senha = login;
    setSalvando(true);
    aoSalvar(novosDados)
      .then(() => setPreceptorEmEdicao({}))
      .catch((err) => error(errors.filtraMensagem(err)))
      .finally(() => {
        setSalvando(false);
      });
  }

  return (
    <Row className="align-items-end">
      <Col sm="6" xl="4" className="mb-2">
        <Form.Group>
          <Form.Label>Nome</Form.Label>
          <Form.Control
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col sm="6" xl="4" className="mb-2">
        <Form.Group>
          <Form.Label>E-mail</Form.Label>
          <Form.Control
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col sm="6" xl="4" className="mb-2">
        <ToggleButton
          id="toggle-check"
          type="checkbox"
          variant="outline-primary"
          checked={trocarSenha}
          onChange={() => setTrocarSenha(!trocarSenha)}
        >
          {trocarSenha ? "Não redefinir" : "Redefinir senha"}
        </ToggleButton>
      </Col>

      <Col sm="12">
        <Button
          className="mt-4"
          onClick={aoSalvarMudancas}
          disabled={!houveMudanca}
        >
          {salvando ? (
            <>
              <Spinner animation="grow" size="sm" className="me-2" /> Salvando
              mudanças...
            </>
          ) : (
            "Salvar mudanças"
          )}
        </Button>
      </Col>
    </Row>
  );
}
