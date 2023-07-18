import { useContext, useRef, useState } from "react";
import { Button, Col, Form, Row, Spinner, ToggleButton } from "react-bootstrap";
import { AlertaContext } from "../../../filters/alerta/Alerta";

export default function PreceptoresEdicao({
  preceptor,
  aoSalvar,
  setPreceptorEmEdicao,
}) {
  const [nome, setNome] = useState(preceptor.nome);
  const [email, setEmail] = useState(preceptor.email);
  const [trocarSenha, setTrocarSenha] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const alerta = useRef(useContext(AlertaContext)).current;

  const houveMudanca =
    trocarSenha || nome !== preceptor.nome || email !== preceptor.email;

  function aoSalvarMudancas() {
    if (!houveMudanca) return;
    const novosDados = {
      id_preceptor: preceptor.id_preceptor,
      nome,
      email,
    };
    if (trocarSenha) novosDados.senha = email;
    setSalvando(true);
    aoSalvar(novosDados)
      .then(() => setPreceptorEmEdicao({}))
      .catch((err) => alerta.adicionaAlerta(err))
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          {trocarSenha ? "A senha será redefinda" : "Redefinir senha"}
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
