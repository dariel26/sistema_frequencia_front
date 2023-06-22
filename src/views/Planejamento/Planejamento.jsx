import { useEffect } from "react";
import { useContext } from "react";
import { useRef } from "react";
import { useState } from "react";
import BotaoTexto from "../../componentes/botoes/BotaoTexto";
import DivCabecalhoDeletar from "../../componentes/divs/DivCabecalhoDeletar";
import TabelaPadrao from "../../componentes/tabelas/TabelaPadrao";
import { AlertaContext } from "../../filters/alert/Alert";
import { UsuarioContext } from "../../filters/User";
import apiSFE from "../../service/api";
import { gerarChaveUnica } from "../../utils";

export default function Planejamento() {
  const [editando, setEditando] = useState(false);
  const [deletando, setDeletando] = useState(false);
  const [ativsLocalADeletar, setAtivsLocalADeletar] = useState([]);
  const [ativsLocal, setAtivsLocal] = useState([]);
  const [estado, setEstado] = useState(0);
  const [atividades, setAtividades] = useState([]);
  const [locais, setLocais] = useState([]);
  const [ativsLocalSelecionadas, setAtivsLocalSelecionadas] = useState([]);

  const usuario = useContext(UsuarioContext);
  const alertaRef = useRef(useContext(AlertaContext));

  const textoSelecao = deletando
    ? "Cancelar"
    : ativsLocalADeletar.length > 0
    ? "Deletar"
    : "Selecionar";

  useEffect(() => {
    const p_ativsLocal = apiSFE.listarAtividadesLocal(usuario.token);
    const p_atividades = apiSFE.listarAtividades(usuario.token);
    const p_locais = apiSFE.listaLugares(usuario.token);
    Promise.all([p_ativsLocal, p_atividades, p_locais]).then((res) => {
      const ativsLocal = res[0].data;
      const atividades = res[1].data;
      const locais = res[2].data;
      setAtivsLocal(ativsLocal);
      setAtividades(atividades);
      setLocais(locais);
    });
  }, [estado]);

  const selecionaAtivLocal = (al) => {
    let dados = ativsLocalSelecionadas;
    if (ativLocalSelecionada(al)) {
      dados = dados.filter(
        (d) => d.id_local !== al.id_local || d.id_atividade !== al.id_atividade
      );
    } else {
      dados.push(al);
    }
    setAtivsLocalSelecionadas(Object.assign([], dados));
  };
  const ativLocalSelecionada = ({ id_local, id_atividade }) => {
    return ativsLocalSelecionadas.some(
      (al) => al.id_atividade === id_atividade && al.id_local === id_local
    );
  };
  const aoDeletarAtivLocal = () => {};
  const aoDeletarAlunos = () => {};
  const aoEditar = () => {
    setEditando(!editando);
  };

  return (
    <div className="row w-100 justify-content-center">
      <div
        id="editar-selecionar"
        className="col-12 position-sticky top-0 bg-white z-1"
      >
        <BotaoTexto
          aoClicar={aoEditar}
          className="mb-2 me-3"
          texto={editando ? "Voltar" : "Editar"}
        />
        <BotaoTexto
          className="mb-2"
          aoClicar={aoDeletarAlunos}
          texto={textoSelecao}
        />
      </div>
      {!editando ? (
        <>
          <div className="col-sm-12 col-xl-8">
            {ativsLocal.map((ativLocal) => (
              <div
                className="mb-2 border-bottom border-4 border-primary"
                key={gerarChaveUnica()}
              >
                <DivCabecalhoDeletar
                  titulo={ativLocal.id_atividade}
                  textoBotao="Deletar Associação"
                  aoDeletar={() => aoDeletarAtivLocal(ativLocal)}
                >
                  <div className="row w-100 align-items-center pb-2 border-bottom m-0">
                    <div className="col-sm-8 p-0 mb-1">
                      <span>Local: </span>
                      <span className={`fw-bold`}>{ativLocal.id_local}</span>
                    </div>
                  </div>
                </DivCabecalhoDeletar>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="col-sm-12 col-xl-8">
            <TabelaPadrao
              aoClicar={(al) => selecionaAtivLocal(al)}
              numerado
              camposCabecalho={[
                { texto: "#", visivel: true },
                { texto: "Nome atividade", visivel: true },
                { texto: "Nome local", visivel: true },
                { texto: "Selecionar", visivel: true },
              ]}
              dados={ativsLocal.map((al) => ({
                ...al,
                nome_local: al.nome_local === null ? "-" : al.nome_local,
              }))}
              camposDados={[
                { texto: "nome_atividade", visivel: true },
                { texto: "nome_local", visivel: true },
                {
                  check: true,
                  visivel: true,
                  selecionado: (al) => ativLocalSelecionada(al),
                },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}
