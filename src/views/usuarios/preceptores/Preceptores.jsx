import { useState } from "react";
import { useRef } from "react";
import { useContext, useEffect } from "react";
import { AlertaContext } from "../../../filters/alerta/Alerta";
import { UsuarioContext } from "../../../filters/Usuario";
import apiSFE from "../../../service/api";
import { Col, Row } from "react-bootstrap";
import { CardLinksBarraFixa } from "../../../componentes/cards/CardLinks";
import BotaoTexto from "../../../componentes/botoes/BotaoTexto";
import TabelaPadrao from "../../../componentes/tabelas/TabelaPadrao";
import { FaUserEdit } from "react-icons/fa";
import PreceptoresAdicao from "./PreceptoresAdicao";
import PreceptoresEdicao from "./PreceptoresEdicao";
import { SistemaContext } from "../../../filters/sistema/Sistema";

export default function Preceptores() {
  const [preceptores, setPreceptores] = useState([]);
  const [adicionando, setAdicionando] = useState(false);
  const [selecionando, setSelecionando] = useState(false);
  const [preceptorEmEdicao, setPreceptorEmEdicao] = useState({});
  const [preceptoresSelecionados, setPreceptoresSelecionados] = useState([]);

  const { carregando } = useRef(useContext(SistemaContext)).current;
  const usuario = useContext(UsuarioContext);
  const alerta = useRef(useContext(AlertaContext)).current;
  const token = usuario.token;

  const nenhumPreceptorSelecionado = preceptoresSelecionados.length === 0;
  const textoBotaoAdicionar = adicionando ? "Voltar" : "Adicionar";
  const textoBotaoSelecionar = selecionando
    ? nenhumPreceptorSelecionado
      ? "Cancelar"
      : "Deletar"
    : "Selecionar";

  useEffect(() => {
    carregando(true);
    apiSFE
      .listarPreceptores(token)
      .then((res) => {
        setPreceptores(res.data);
      })
      .catch((err) => {
        alerta.adicionaAlerta(err);
      })
      .finally(() => carregando(false));
  }, [token, alerta, carregando]);

  async function aoClicarSelecionar() {
    if (nenhumPreceptorSelecionado) return setSelecionando(!selecionando);
    try {
      await aoDeletar();
    } catch (err) {
      alerta.adicionaAlerta(err);
    }
  }

  function aoClicarSelecionarPreceptor(preceptor) {
    if (preceptorSelecionado(preceptor))
      setPreceptoresSelecionados((selecionados) =>
        selecionados.filter((p) => p.id_usuario !== preceptor.id_usuario)
      );
    else
      setPreceptoresSelecionados((selecionados) => [
        ...selecionados,
        preceptor,
      ]);
  }

  function preceptorSelecionado({ id_usuario }) {
    return preceptoresSelecionados.some((c) => c.id_usuario === id_usuario);
  }

  async function aoDeletar() {
    const ids = preceptoresSelecionados.map((p) => p.id_usuario);
    const preceptoresRestantes = preceptores.filter(
      (pr) => !preceptorSelecionado(pr)
    );
    try {
      await apiSFE.deletarPreceptores(token, ids);
      setPreceptores([...preceptoresRestantes]);
      setPreceptoresSelecionados([]);
    } catch (err) {
      alerta.adicionaAlerta(err);
    }
  }

  async function aoAdicionar(preceptores) {
    const novosPreceptores = preceptores.map(({ nome, email }) => ({
      nome,
      login: email,
      senha: email, //TODO API deveria fazer isto
    }));
    if (novosPreceptores.length < 1) return;
    try {
      const { data } = await apiSFE.adicionarPreceptores(
        token,
        novosPreceptores
      );
      setPreceptores(data);
    } catch (err) {
      throw err;
    }
  }

  async function aoEditar(novosDados) {
    try {
      await apiSFE.editatPreceptores(token, novosDados);
      setPreceptores((existentes) => {
        const index = existentes.findIndex(
          (p) => p.id_usuario === novosDados.id_usuario
        );
        existentes[index] = { ...existentes[index], ...novosDados };
        return existentes;
      });
      return true;
    } catch (err) {
      throw err;
    }
  }

  return (
    <Row className="justify-content-center w-100 m-0">
      <CardLinksBarraFixa>
        <BotaoTexto
          aoClicar={() => {
            setAdicionando(!adicionando);
          }}
          className="mb-2 me-3"
          texto={textoBotaoAdicionar}
          visivel={!preceptorEmEdicao.id_usuario}
        />
        <BotaoTexto
          aoClicar={aoClicarSelecionar}
          className="mb-2"
          texto={textoBotaoSelecionar}
          visivel={!adicionando && !preceptorEmEdicao.id_usuario}
          assincrono
        />
        <BotaoTexto
          aoClicar={() => setPreceptorEmEdicao({})}
          className="mb-2"
          texto={"Cancelar"}
          visivel={preceptorEmEdicao.id_usuario}
        />
      </CardLinksBarraFixa>
      {adicionando ? (
        <PreceptoresAdicao
          preceptores={preceptores}
          aoAdicionarNovosPreceptores={aoAdicionar}
          setAdicionando={setAdicionando}
        />
      ) : preceptorEmEdicao.id_usuario ? (
        <PreceptoresEdicao
          preceptor={preceptorEmEdicao}
          aoSalvar={aoEditar}
          setPreceptorEmEdicao={setPreceptorEmEdicao}
        />
      ) : (
        <Col sm="12" xl="8">
          <TabelaPadrao
            numerado
            aoClicar={aoClicarSelecionarPreceptor}
            camposCabecalho={[
              { texto: "#", visivel: true },
              { texto: "Nome", visivel: true },
              { texto: "Email", visivel: true },
              { texto: "Editar", visivel: true },
              { texto: "Deletar", visivel: selecionando },
            ]}
            campoDadoUnico="id_usuario"
            dados={preceptores}
            camposDados={[
              { texto: "nome", visivel: true },
              { texto: "login", visivel: true },
              {
                funcaoComponente: (dado) => (
                  <label
                    type="button"
                    className="p-0"
                    onClick={() => setPreceptorEmEdicao(dado)}
                  >
                    <FaUserEdit size={18} />
                  </label>
                ),
                visivel: true,
              },
              {
                check: true,
                visivel: selecionando,
                selecionado: preceptorSelecionado,
              },
            ]}
          />
        </Col>
      )}
    </Row>
  );
}
