import { useContext, useRef, useState } from "react";
import { Button, Col, Form, Row, Spinner, ToggleButton } from "react-bootstrap";
import { AlertaContext } from "../../../filters/alert/Alert";

export default function AlunosEdicao({ aluno, aoSalvar, setAlunoEmEdicao }) {
  const [nome, setNome] = useState(aluno.nome);
  const [matricula, setMatricula] = useState(aluno.matricula);
  const [trocarSenha, setTrocarSenha] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const alerta = useRef(useContext(AlertaContext)).current;

  const houveMudanca =
    trocarSenha || nome !== aluno.nome || matricula !== aluno.matricula;

  function aoSalvarMudancas() {
    if (!houveMudanca) return;
    const novosDados = {
      id_aluno: aluno.id_aluno,
      nome,
      matricula,
    };
    if (trocarSenha) novosDados.senha = matricula;
    setSalvando(true);
    aoSalvar(novosDados)
      .then(() => setAlunoEmEdicao({}))
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
          <Form.Label>Matrícula</Form.Label>
          <Form.Control
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
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
