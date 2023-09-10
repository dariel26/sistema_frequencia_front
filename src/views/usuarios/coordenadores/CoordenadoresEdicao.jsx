import { useContext, useRef, useState } from "react";
import { Button, Col, Form, Row, Spinner, ToggleButton } from "react-bootstrap";
import { SistemaContext } from "../../../contexts";
import { errors } from "../../../utils";

export default function CoordenadorEdicao({
  coordenador,
  aoSalvar,
  setCoordenadorEmEdicao,
}) {
  const [nome, setNome] = useState(coordenador.nome);
  const [email, setEmail] = useState(coordenador.login);
  const [trocarSenha, setTrocarSenha] = useState(false);
  const [tornarAdmin, setTornarAdmin] = useState(
    coordenador.papeis.includes("ADMIN")
  );
  const [salvando, setSalvando] = useState(false);

  const { error } = useRef(useContext(SistemaContext)).current;

  const houveMudanca =
    trocarSenha ||
    tornarAdmin !== coordenador.papeis.includes("ADMIN") ||
    nome !== coordenador.nome ||
    email !== coordenador.login;

  function aoSalvarMudancas() {
    if (!houveMudanca) return;
    const novosDados = {
      id_usuario: coordenador.id_usuario,
      nome,
      login: email,
      papeis: tornarAdmin
        ? [...coordenador.papeis, "ADMIN"]
        : coordenador.papeis.filter((p) => p !== "ADMIN"),
    };
    if (trocarSenha) novosDados.senha = email;
    setSalvando(true);
    aoSalvar(novosDados)
      .then(() => setCoordenadorEmEdicao({}))
      .catch((err) => error(errors.filtraMensagem(err)))
      .finally(() => {
        setSalvando(false);
      });
  }

  return (
    <Row className="align-items-end">
      <Col sm="6" xl="3" className="mb-2">
        <Form.Group>
          <Form.Label>Nome</Form.Label>
          <Form.Control
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col sm="6" xl="3" className="mb-2">
        <Form.Group>
          <Form.Label>E-mail</Form.Label>
          <Form.Control
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
      </Col>
      <Col sm="6" xl="3" className="mb-2">
        <ToggleButton
          id="admin"
          type="checkbox"
          variant="outline-primary"
          checked={tornarAdmin}
          onChange={() => setTornarAdmin(!tornarAdmin)}
        >
          {tornarAdmin ? "Retirar papel ADMIN" : "Adicionar papel ADMIN"}
        </ToggleButton>
      </Col>
      <Col sm="6" xl="3" className="mb-2">
        <ToggleButton
          id="senha"
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
