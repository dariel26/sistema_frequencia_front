import { useContext, useRef, useState } from "react";
import { Button, Col, Form, Row, Spinner, ToggleButton } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { AlertaContext } from "../../../filters/alert/Alert";

export default function CoordenadorEdicao({
  coordenador,
  aoSalvar,
  setCoordenadorEmEdicao,
}) {
  const [nome, setNome] = useState(coordenador.nome);
  const [email, setEmail] = useState(coordenador.email);
  const [papel, setPapel] = useState(coordenador.papel);
  const [trocarSenha, setTrocarSenha] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const alerta = useRef(useContext(AlertaContext)).current;

  const houveMudanca =
    trocarSenha ||
    nome !== coordenador.nome ||
    email !== coordenador.email ||
    papel !== coordenador.papel;

  function aoSalvarMudancas() {
    if (!houveMudanca) return;
    const novosDados = {
      id_coordenador: coordenador.id_coordenador,
      nome,
      email,
      papel,
    };
    if (trocarSenha) novosDados.senha = email;
    setSalvando(true);
    aoSalvar(novosDados)
      .then(() => setCoordenadorEmEdicao({}))
      .catch((err) => alerta.adicionaAlerta(err))
      .finally(() => {
        setSalvando(false);
      });
  }

  function selecionaTexto(e) {
    const input = e.target;
    setTimeout(() => {
      input.setSelectionRange(0, e.target.value.length);
    }, 200);
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
        <Form.Group>
          <Form.Label>Papel</Form.Label>
          <Typeahead
            id="papel-coordenador"
            emptyLabel={"Nenhum registro"}
            onChange={(papeis) => setPapel(papeis[0])}
            options={["ADMIN", "COORDENADOR(A)"]}
            defaultInputValue={papel}
            onFocus={selecionaTexto}
            multiple={false}
          />
        </Form.Group>
      </Col>
      <Col sm="6" xl="3" className="mb-2">
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
