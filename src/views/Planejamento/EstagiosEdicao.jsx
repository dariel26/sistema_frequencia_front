import { useRef, useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import FormData from "../../componentes/formularios/FormData";
import FormSelecao from "../../componentes/formularios/FormSelecao";
import TabelaPadrao from "../../componentes/tabelas/TabelaPadrao";
import { AlertaContext } from "../../filters/alert/Alert";
import { UsuarioContext } from "../../filters/User";
import apiSFE from "../../service/api";
import { formatarDataAMD } from "../../utils";
import { AiOutlineDelete } from "react-icons/ai";
import { Spinner } from "react-bootstrap";

export default function EstagiosEdicao() {
  const [estagios, setEstagios] = useState([]);
  const [coordenadores, setCoordenadores] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [datas, setDatas] = useState([]);
  const [estado, setEstado] = useState(0);
  const [salvando, setSalvando] = useState(false);

  const usuario = useContext(UsuarioContext);
  const alerta = useRef(useContext(AlertaContext)).current;
  const token = usuario.token;

  useEffect(() => {
    const p_estagios = apiSFE.listarEstagios(token);
    const p_coordenadores = apiSFE.listarCoordenadores(token);
    const p_grupos = apiSFE.listarGrupos(token);
    Promise.all([p_estagios, p_coordenadores, p_grupos])
      .then((res) => {
        setEstagios(res[0].data);
        setCoordenadores(res[1].data);
        setGrupos(res[2].data);
      })
      .catch((err) => alerta.adicionaAlerta(err));
  }, [estado, alerta, token]);

  const aoAdicionarCoordenador = async ({
    valor: coordenador,
    opcao: estagio,
  }) => {
    let dados = [
      {
        id_estagio: estagio.id_estagio,
        id_coordenador: coordenador.id_coordenador,
      },
    ];
    try {
      await apiSFE.adicionarCoordenadoresAEstagios(token, dados);
      setEstado((reset) => reset + 1);
    } catch (err) {
      alerta.adicionaAlerta(err);
    }
  };

  const dataJaSelecionada = (data) =>
    datas.some((d) => d.data_inicial === data.data_inicial);

  const aoSelecionarData = (data) => {
    if (!dataJaSelecionada(data)) {
      datas.push(data);
      setDatas(Object.assign([], datas));
    } else {
      alerta.adicionaAlerta(
        new Error("Essa data inicial já existe em outro intervalo")
      );
    }
  };

  const aoAlocarAutomatico = () => {
    if (datas.length === 0)
      return alerta.adicionarAlerta(new Error("Nenhuma data adicionada"));
    if (estagios.length === 0)
      return alerta.adicionaAlerta(new Error("Nenhum estágio encontrado"));
    if (datas.length !== grupos.length)
      alerta.adicionaAlerta(
        new Error(
          "O número de intervalos de datas deve ser igual a " + grupos.length
        )
      );
    else {
      const dados = [];
      const gruposAgrupados = [];
      for (let k = 0; k < grupos.length; k++) {
        const iteracao = gruposAgrupados.length;
        const vetorGrupo = [];
        const vetorAuxiliar = [];
        for (let i = 0; i < grupos.length; i++) {
          const ultimo = grupos.length - 1;
          if (iteracao >= i + 1) {
            vetorAuxiliar.push(grupos[i].id_grupo);
          } else if (i === ultimo) {
            vetorGrupo.push(grupos[i].id_grupo);
            gruposAgrupados.push(vetorGrupo.concat(vetorAuxiliar));
          } else {
            vetorGrupo.push(grupos[i].id_grupo);
          }
        }
      }
      const gruposOrdenados = gruposAgrupados.flat();
      const gruposDatas = [];
      for (let i = 0; i < gruposOrdenados.length; i++) {
        const dado = {};
        dado.id_grupo = gruposOrdenados[i];
        dado.data_inicial = datas[i % datas.length].data_inicial;
        dado.data_final = datas[i % datas.length].data_final;
        gruposDatas.push(dado);
      }
      for (let i = 0; i < estagios.length; i++) {
        const id_estagio = estagios[i].id_estagio;
        for (let j = 0; j < estagios.length; j++) {
          if (gruposDatas[i * estagios.length + j] === undefined) break;
          const dado = gruposDatas[i * estagios.length + j];
          dado.id_estagio = id_estagio;
          dados.push(dado);
        }
      }

      setSalvando(true);
      apiSFE
        .adicionarGruposAEstagios(token, dados)
        .then(() => setEstado(estado + 1))
        .catch((err) => alerta.adicionaAlerta(err))
        .finally(() => setSalvando(false));
    }
  };

  const aoDeletarData = (data) => {
    setDatas((datas) =>
      datas.filter((d) => formatarDataAMD(d.data_inicial) !== data.data_inicial)
    );
  };

  return (
    <>
      <div className="col-sm-12 col-xl-8 mb-4">
        <TabelaPadrao
          numerado
          camposCabecalho={[
            { texto: "#", visivel: true },
            { texto: "Estagio", visivel: true },
            { texto: "Coordenador", visivel: true },
            { texto: "Datas alocadas", visivel: true },
          ]}
          dados={estagios.map(({ nome_estagio, nome_coordenador, grupos }) => ({
            nome_estagio,
            nome_coordenador,
            qntd_grupos: grupos.length,
          }))}
          camposDados={[
            { texto: "nome_estagio", visivel: true },
            { texto: "nome_coordenador", visivel: true },
            { texto: "qntd_grupos", visivel: true },
          ]}
        />
      </div>
      <div className="col-sm-12 col-xl-8 mb-4">
        <FormSelecao
          titulo="Coordenador"
          textoReferencia="Escolha o coordenador"
          campoSelecao="nome"
          opcoesSelecao={coordenadores}
          textoBotao="Adicionar ao estagio..."
          opcoesDrop={estagios}
          campoDrop="nome_estagio"
          aoEscolher={aoAdicionarCoordenador}
        />
      </div>
      <div className="col-sm-12 col-xl-8 mb-4">
        <FormData
          titulo="Escolha um intervalo"
          textoBotao="Adicionar"
          aoSelecionarDatas={aoSelecionarData}
        />
      </div>
      <div className="col-sm-12 col-xl-8">
        <button
          className="btn btn-secondary"
          disabled={salvando}
          onClick={aoAlocarAutomatico}
        >
          {salvando ? (
            <Spinner size="sm" animation="grow" className="me-2" />
          ) : undefined}
          Alocação Automática
        </button>
      </div>
      <div className="col-sm-12 col-xl-8 ">
        <TabelaPadrao
          numerado
          camposCabecalho={[
            { texto: "#", visivel: true },
            { texto: "Data inicial", visivel: true },
            { texto: "Data final", visivel: true },
            { texto: "Deletar", visivel: true },
          ]}
          dados={datas.map(({ data_inicial, data_final }) => ({
            data_inicial: formatarDataAMD(data_inicial),
            data_final: formatarDataAMD(data_final),
          }))}
          camposDados={[
            { data: "data_inicial", visivel: true },
            { data: "data_final", visivel: true },
            {
              funcaoComponente: (data) => (
                <button className="btn" onClick={() => aoDeletarData(data)}>
                  <AiOutlineDelete size={18} />
                </button>
              ),
              visivel: true,
            },
          ]}
        />
      </div>
    </>
  );
}
