import { useState } from "react";
import { useRef } from "react";
import { useContext, useEffect } from "react";
import { AlertaContext } from "../../../filters/alert/Alert";
import { UsuarioContext } from "../../../filters/User";
import apiSFE from "../../../service/api";
import { Col, Row } from "react-bootstrap";
import { CardLinksBarraFixa } from "../../../componentes/cards/CardLinks";
import BotaoTexto from "../../../componentes/botoes/BotaoTexto";
import TabelaPadrao from "../../../componentes/tabelas/TabelaPadrao";
import CoordenadoresAdicao from "./CoordenadoresAdicao";
import { FaUserEdit } from "react-icons/fa";
import CoordenadorEdicao from "./CoordenadoresEdicao";

export function Coordenadores() {
  const [coordenadores, setCoordenadores] = useState([]);
  const [adicionando, setAdicionando] = useState(false);
  const [selecionando, setSelecionando] = useState(false);
  const [coordenadorEmEdicao, setCoordenadorEmEdicao] = useState({});
  const [coordenadoresSelecionados, setCoordenadoresSelecionados] = useState(
    []
  );

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
    apiSFE
      .listarCoordenadores(usuario.token)
      .then((res) => {
        setCoordenadores(res.data);
      })
      .catch((err) => {
        alerta.adicionaAlerta(err);
      });
  }, [usuario, alerta]);

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
        selecionados.filter(
          (c) => c.id_coordenador !== coordenador.id_coordenador
        )
      );
    else
      setCoordenadoresSelecionados((selecionados) => [
        ...selecionados,
        coordenador,
      ]);
  }

  function coordenadorSelecionado({ id_coordenador }) {
    return coordenadoresSelecionados.some(
      (c) => c.id_coordenador === id_coordenador
    );
  }

  async function aoDeletar() {
    const ids = coordenadoresSelecionados.map((c) => c.id_coordenador);
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
      email,
      senha: email,
    }));
    if (novosCoordenadores.length < 1) return;
    try {
      const { data } = await apiSFE.adicionarCoordenadores(
        token,
        novosCoordenadores
      );
      setCoordenadores(data);
    } catch (err) {
      throw err;
    }
  }

  async function aoEditar(novosDados) {
    console.log(novosDados);
    try {
      await apiSFE.editarCoordenadores(usuario.token, [novosDados]);
      setCoordenadores((existentes) => {
        const index = existentes.findIndex(
          (c) => c.id_coordenador === novosDados.id_coordenador
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
          visivel={!coordenadorEmEdicao.id_coordenador}
        />
        <BotaoTexto
          aoClicar={aoClicarSelecionar}
          className="mb-2"
          texto={textoBotaoSelecionar}
          visivel={!adicionando && !coordenadorEmEdicao.id_coordenador}
          assincrono
        />
        <BotaoTexto
          aoClicar={() => setCoordenadorEmEdicao({})}
          className="mb-2"
          texto={"Cancelar"}
          visivel={coordenadorEmEdicao.id_coordenador}
        />
      </CardLinksBarraFixa>
      {adicionando ? (
        <CoordenadoresAdicao
          coordenadores={coordenadores}
          aoAdicionarNovosCoordenadores={aoAdicionar}
          setAdicionando={setAdicionando}
        />
      ) : coordenadorEmEdicao.id_coordenador ? (
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
              { texto: "Papel", visivel: true },
              { texto: "Editar", visivel: true },
              { texto: "Deletar", visivel: selecionando },
            ]}
            campoDadoUnico="id_coordenador"
            dados={coordenadores}
            camposDados={[
              { texto: "nome", visivel: true },
              { texto: "email", visivel: true },
              { texto: "papel", visivel: true },
              {
                funcaoComponente: (dado) => (
                  <label
                    type="button"
                    className="p-0"
                    onClick={() => setCoordenadorEmEdicao(dado)}
                  >
                    <FaUserEdit size={18} />
                  </label>
                ),
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
