import {
  Button,
  Col,
  Form,
  InputGroup,
  OverlayTrigger,
  Spinner,
  Tooltip,
} from "react-bootstrap";
import { read, utils } from "xlsx";
import { FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import TabelaPadrao from "../../../componentes/tabelas/TabelaPadrao";
import { useContext, useRef, useState } from "react";
import { AlertaContext } from "../../../filters/alert/Alert";

export default function CoordenadoresAdicao({
  coordenadores,
  aoAdicionarNovosCoordenadores,
  setAdicionando,
}) {
  const [nomeArquivo, setNomeArquivo] = useState();
  const [novosCoordenadores, setNovosCoordenadores] = useState([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [salvando, setSalvando] = useState(false);

  const alerta = useRef(useContext(AlertaContext)).current;

  const textoValido = "Coordenador válido";
  const textoInvalido =
    "Um coordenador com esse e-mail já existe portanto este coordenador não será adicionado";

  const coordenadoresNaoRepetidos = novosCoordenadores.filter(
    (c) => !coordenadorExiste(c)
  );

  function aoSelecionarArquivo(e) {
    const reader = new FileReader();
    reader.addEventListener("load", lerArquivo);
    reader.readAsArrayBuffer(e.target?.files[0]);
    setNomeArquivo(e.target?.files[0]?.name);
  }

  function lerArquivo(e) {
    const dados = new Uint8Array(e.target.result);
    const workbook = read(dados, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonDados = utils.sheet_to_json(worksheet);
    setNovosCoordenadores((existentes) => [...existentes, ...jsonDados]);
  }

  function coordenadorExiste({ email }) {
    return coordenadores?.some((c) => c.email === email);
  }

  function aoAdicionarCoordenadorManualmente(e) {
    e.preventDefault();
    if (email === "") return;
    if (nome === "") return;
    setNovosCoordenadores((existentes) => [...existentes, { nome, email }]);
    setNome("");
    setEmail("");
  }

  function aoCadastrarNovosCoordenadores(e) {
    e.preventDefault();
    if (coordenadoresNaoRepetidos.length < 1) return;
    setSalvando(true);
    aoAdicionarNovosCoordenadores(coordenadoresNaoRepetidos)
      .then(() => setAdicionando(false))
      .catch((err) => alerta.adicionaAlerta(err))
      .finally(() => setSalvando(false));
    setNovosCoordenadores([]);
  }

  return (
    <>
      <Col sm="6" xl="4">
        <Form.Group className="mb-3">
          <Col>
            <Form.Label>Selecione um arquivo</Form.Label>
            <Form.Control
              type="file"
              accept=".xlsx,.ods"
              id="file-coordenador"
              className="d-none"
              onChange={aoSelecionarArquivo}
            />
            <InputGroup className="mb-3">
              <label
                role="button"
                className="btn btn-primary text-nowrap"
                htmlFor="file-coordenador"
              >
                Procurar
              </label>
              <Form.Control
                readOnly
                value={nomeArquivo ?? "Nenhum arquivo..."}
              />
            </InputGroup>
          </Col>
        </Form.Group>
      </Col>
      <Col sm="6" xl="8">
        <Form
          className="align-items-end row"
          onSubmit={aoAdicionarCoordenadorManualmente}
        >
          <Col sm="12" xl="5" className="mb-2">
            <Form.Label htmlFor="E-mail">E-mail do coordenador</Form.Label>
            <Form.Control
              id="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Col>
          <Col sm="12" xl="5" className="mb-2">
            <Form.Label htmlFor="Nome">Nome do coordenador</Form.Label>
            <Form.Control
              id="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </Col>
          <Col sm="12" xl="2" className="mb-2">
            <Button type="submit" disabled={nome === "" || email === ""}>
              Adicionar
            </Button>
          </Col>
        </Form>
      </Col>
      <Col sm="12" xl="8" className="mt-5 mb-2">
        <Button
          onClick={aoCadastrarNovosCoordenadores}
          disabled={coordenadoresNaoRepetidos.length < 1}
        >
          {salvando ? (
            <>
              <Spinner size="sm" animation="grow" className="me-2" />{" "}
              Cadastrando coordenadores...
            </>
          ) : (
            "Cadastrar coordenadores"
          )}
        </Button>
      </Col>
      <Col sm="12" xl="8">
        <TabelaPadrao
          numerado
          camposCabecalho={[
            { texto: "#", visivel: true },
            { texto: "Nome", visivel: true },
            { texto: "E-mail", visivel: true },
            { texto: "Válido", visivel: true },
          ]}
          dados={novosCoordenadores}
          camposDados={[
            { texto: "nome", visivel: true },
            { texto: "email", visivel: true },
            {
              funcaoComponente: (dado) => (
                <OverlayTrigger
                  overlay={
                    <Tooltip>
                      {coordenadorExiste(dado) ? textoInvalido : textoValido}
                    </Tooltip>
                  }
                >
                  <span>
                    {coordenadorExiste(dado) ? (
                      <FiAlertTriangle size={18} color="var(--bs-warning)" />
                    ) : (
                      <FiCheckCircle size={18} color="var(--bs-success)" />
                    )}
                  </span>
                </OverlayTrigger>
              ),
              visivel: true,
            },
          ]}
        />
      </Col>
    </>
  );
}
