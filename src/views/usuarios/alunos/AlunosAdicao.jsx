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
import { TabelaPadrao } from "../../../componentes";
import { useContext, useRef, useState } from "react";
import { SistemaContext } from "../../../contexts";
import { errors } from "../../../utils";

export default function AlunoAdicao({
  alunos,
  aoAdicionarNovosAlunos,
  setAdicionando,
}) {
  const [nomeArquivo, setNomeArquivo] = useState();
  const [novosAlunos, setNovosAlunos] = useState([]);
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [salvando, setSalvando] = useState(false);

  const { error } = useRef(useContext(SistemaContext)).current;

  const textoValido = "Aluno válido";
  const textoInvalido =
    "Um aluno com essa matrícula já existe portanto este aluno não será adicionado";

  const alunosNaoRepetidos = novosAlunos.filter((c) => !alunoExistente(c));

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
    setNovosAlunos((existentes) => [...existentes, ...jsonDados]);
  }

  function alunoExistente({ matricula }) {
    return alunos?.some((p) => p.login === matricula);
  }

  function aoAdicionarAlunoManualmente(e) {
    e.preventDefault();
    if (matricula === "") return;
    if (nome === "") return;
    setNovosAlunos((existentes) => [...existentes, { nome, matricula }]);
    setNome("");
    setMatricula("");
  }

  function aoCadastrarNovosAlunos(e) {
    e.preventDefault();
    if (alunosNaoRepetidos.length < 1) return;
    setSalvando(true);
    aoAdicionarNovosAlunos(alunosNaoRepetidos)
      .then(() => setAdicionando(false))
      .catch((err) => error(errors.filtraMensagem(err)))
      .finally(() => setSalvando(false));
    setNovosAlunos([]);
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
              id="file-aluno"
              className="d-none"
              onChange={aoSelecionarArquivo}
            />
            <InputGroup className="mb-3">
              <label
                role="button"
                className="btn btn-primary text-nowrap"
                htmlFor="file-aluno"
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
          onSubmit={aoAdicionarAlunoManualmente}
        >
          <Col sm="12" xl="5" className="mb-2">
            <Form.Label htmlFor="Matricula">Matrícula do aluno</Form.Label>
            <Form.Control
              id="Matricula"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
            />
          </Col>
          <Col sm="12" xl="5" className="mb-2">
            <Form.Label htmlFor="Nome">Nome do aluno</Form.Label>
            <Form.Control
              id="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </Col>
          <Col sm="12" xl="2" className="mb-2">
            <Button type="submit" disabled={nome === "" || matricula === ""}>
              Adicionar
            </Button>
          </Col>
        </Form>
      </Col>
      <Col sm="12" xl="8" className="mt-5 mb-2">
        <Button
          onClick={aoCadastrarNovosAlunos}
          disabled={alunosNaoRepetidos.length < 1}
        >
          {salvando ? (
            <>
              <Spinner size="sm" animation="grow" className="me-2" />{" "}
              Cadastrando alunos...
            </>
          ) : (
            "Cadastrar alunos"
          )}
        </Button>
      </Col>
      <Col sm="12" xl="8">
        <TabelaPadrao
          numerado
          camposCabecalho={[
            { texto: "#", visivel: true },
            { texto: "Nome", visivel: true },
            { texto: "Matrícula", visivel: true },
            { texto: "Válido", visivel: true },
          ]}
          dados={novosAlunos}
          camposDados={[
            { texto: "nome", visivel: true },
            { texto: "matricula", visivel: true },
            {
              funcaoComponente: (dado) => (
                <OverlayTrigger
                  overlay={
                    <Tooltip>
                      {alunoExistente(dado) ? textoInvalido : textoValido}
                    </Tooltip>
                  }
                >
                  <span>
                    {alunoExistente(dado) ? (
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
