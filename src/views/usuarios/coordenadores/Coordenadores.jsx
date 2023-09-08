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
import CoordenadoresAdicao from "./CoordenadoresAdicao";
import { FaUserEdit } from "react-icons/fa";
import CoordenadorEdicao from "./CoordenadoresEdicao";
import { SistemaContext } from "../../../filters/sistema/Sistema";

export default function Coordenadores() {
  const [coordenadores, setCoordenadores] = useState([]);
  const [adicionando, setAdicionando] = useState(false);
  const [selecionando, setSelecionando] = useState(false);
  const [coordenadorEmEdicao, setCoordenadorEmEdicao] = useState({});
  const [coordenadoresSelecionados, setCoordenadoresSelecionados] = useState(
    []
  );

  const { carregando } = useRef(useContext(SistemaContext)).current;
  const usuario = useContext(UsuarioContext);
  const alerta = useRef(useContext(AlertaContext)).current;
  const token = usuario.token;

  const nenhumCoordenadorSelecionado = coordenadoresSelecionados.length === 0;
  const textoBotaoAdicionar = adicionando ? "Voltar" : "Adicionar";
  const textoBotaoSelecionar = selecionando
    ? nenhumCoordenadorSelecionado
      ? "Cancelar"
      : "Deletar"
    : "Selecionar";

  useEffect(() => {
    carregando(true);
    apiSFE
      .listarCoordenadores(usuario.token)
      .then((res) => {
        setCoordenadores(res.data);
      })
      .catch((err) => {
        alerta.adicionaAlerta(err);
      })
      .finally(() => carregando(false));
  }, [usuario, alerta, carregando]);

  async function aoClicarSelecionar() {
    if (nenhumCoordenadorSelecionado) return setSelecionando(!selecionando);
    try {
      await aoDeletar();
    } catch (err) {
      alerta.adicionaAlerta(err);
    }
  }

  function aoClicarSelecionarCoordenador(coordenador) {
    if (coordenadorSelecionado(coordenador))
      setCoordenadoresSelecionados((selecionados) =>
        selecionados.filter((c) => c.id_usuario !== coordenador.id_usuario)
      );
    else
      setCoordenadoresSelecionados((selecionados) => [
        ...selecionados,
        coordenador,
      ]);
  }

  function coordenadorSelecionado({ id_usuario }) {
    return coordenadoresSelecionados.some((c) => c.id_usuario === id_usuario);
  }

  async function aoDeletar() {
    const ids = coordenadoresSelecionados.map((c) => c.id_usuario);
    const coordenadoresRestantes = coordenadores.filter(
      (cr) => !coordenadorSelecionado(cr)
    );
    try {
      await apiSFE.deletarCoordenadores(usuario.token, ids);
      setCoordenadores([...coordenadoresRestantes]);
      setCoordenadoresSelecionados([]);
    } catch (err) {
      alerta.adicionaAlerta(err);
    }
  }

  async function aoAdicionar(coordenadores) {
    const novosCoordenadores = coordenadores.map(({ nome, email }) => ({
      nome,
      login: email,
      senha: email,
    }));
    if (novosCoordenadores.length < 1) return;
    try {
      const { data } = await apiSFE.adicionarCoordenadores(
        token,
        novosCoordenadores
      );
      setCoordenadores(data);
      return "Coordenadores adicionados!";
    } catch (err) {
      throw err;
    }
  }

  async function aoEditar(novosDados) {
    try {
      await apiSFE.editarCoordenadores(usuario.token, novosDados);
      setCoordenadores((existentes) => {
        const index = existentes.findIndex(
          (c) => c.id_usuario === novosDados.id_usuario
        );
        existentes[index] = { ...existentes[index], ...novosDados };
        return existentes;
      });
      return "Coordenador editado!";
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
          visivel={!coordenadorEmEdicao.id_usuario}
        />
        <BotaoTexto
          aoClicar={aoClicarSelecionar}
          className="mb-2"
          texto={textoBotaoSelecionar}
          visivel={!adicionando && !coordenadorEmEdicao.id_usuario}
          assincrono
        />
        <BotaoTexto
          aoClicar={() => setCoordenadorEmEdicao({})}
          className="mb-2"
          texto={"Cancelar"}
          visivel={coordenadorEmEdicao.id_usuario}
        />
      </CardLinksBarraFixa>
      {adicionando ? (
        <CoordenadoresAdicao
          coordenadores={coordenadores}
          aoAdicionarNovosCoordenadores={aoAdicionar}
          setAdicionando={setAdicionando}
        />
      ) : coordenadorEmEdicao.id_usuario ? (
        <CoordenadorEdicao
          coordenador={coordenadorEmEdicao}
          aoSalvar={aoEditar}
          setCoordenadorEmEdicao={setCoordenadorEmEdicao}
        />
      ) : (
        <Col sm="12" xl="8">
          <TabelaPadrao
            numerado
            aoClicar={aoClicarSelecionarCoordenador}
            camposCabecalho={[
              { texto: "#", visivel: true },
              { texto: "Nome", visivel: true },
              { texto: "Email", visivel: true },
              { texto: "Administrador", visivel: true },
              { texto: "Editar", visivel: true },
              { texto: "Deletar", visivel: selecionando },
            ]}
            campoDadoUnico="id_usuario"
            dados={coordenadores}
            camposDados={[
              { texto: "nome", visivel: true },
              { texto: "login", visivel: true },
              {
                funcaoComponente: (dado) => {
                  return dado.papeis.includes("ADMIN") ? "Sim" : "Não";
                },
                visivel: true,
              },
              {
                funcaoComponente: (dado) => {
                  return dado.id_usuario !== usuario.id_usuario ? (
                    <label
                      type="button"
                      className="p-0"
                      onClick={() => setCoordenadorEmEdicao(dado)}
                    >
                      <FaUserEdit size={18} />
                    </label>
                  ) : undefined;
                },
                visivel: true,
              },
              {
                check: true,
                visivel: selecionando,
                selecionado: coordenadorSelecionado,
              },
            ]}
          />
        </Col>
      )}
    </Row>
  );
}
