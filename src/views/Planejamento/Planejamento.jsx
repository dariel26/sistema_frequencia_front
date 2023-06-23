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
import { PlanejamentoEditando } from "./PlanejamentoEditando";

export default function Planejamento() {
  const [editando, setEditando] = useState(false);
  const [deletando, setDeletando] = useState(false);
  const [ativsLocalADeletar, setAtivsLocalADeletar] = useState([]);
  const [ativsLocal, setAtivsLocal] = useState([]);
  const [estado, setEstado] = useState(0);
  const [atividades, setAtividades] = useState([]);
  const [locais, setLocais] = useState([]);
  const [estagios, setEstagios] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [preceptores, setPreceptores] = useState([]);

  const usuario = useContext(UsuarioContext);
  const alertaRef = useRef(useContext(AlertaContext));

  const associacoes = ativsLocal.filter((al) => al.id_atividadelocal !== null);
  const textoSelecao = deletando
    ? "Cancelar"
    : ativsLocalADeletar.length > 0
    ? "Deletar"
    : "Selecionar";

  useEffect(() => {
    const p_ativsLocal = apiSFE.listarAtividadesLocal(usuario.token);
    const p_atividades = apiSFE.listarAtividades(usuario.token);
    const p_locais = apiSFE.listaLugares(usuario.token);
    const p_estagios = apiSFE.listarEstagios(usuario.token);
    const p_grupos = apiSFE.listarGrupos(usuario.token);
    const p_preceptores = apiSFE.listarPreceptores(usuario.token);

    Promise.all([
      p_ativsLocal,
      p_atividades,
      p_locais,
      p_estagios,
      p_grupos,
      p_preceptores,
    ]).then((res) => {
      const ativsLocal = res[0].data;
      const atividades = res[1].data;
      const locais = res[2].data;
      const estagios = res[3].data;
      const grupos = res[4].data;
      const preceptores = res[5].data;

      setAtivsLocal(ativsLocal);
      setAtividades(atividades);
      setLocais(locais);
      setEstagios(estagios);
      setGrupos(grupos);
      setPreceptores(preceptores);
    });
  }, [estado]);

  const aoAssociarAtividade = (local, atividadesLocal) => {
    if (atividadesLocal.length < 1)
      return alertaRef.current.addAlert(
        new Error("Nenhuma atividade selecionada")
      );
    if (local.id_local === null) {
      const ids = atividadesLocal.map((al) => al.id_atividadelocal);
      apiSFE
        .deletarAtividadesLocal(usuario.token, ids)
        .then(() => setEstado(estado + 1))
        .catch((err) => alertaRef.current.addAlert(err));
    } else {
      const aCriar = atividadesLocal.map((dado) => ({
        id_atividade: dado.id_atividade,
        id_local: local.id_local,
      }));

      apiSFE
        .adicionarAtividadesLocal(usuario.token, aCriar)
        .then(() => setEstado(estado + 1))
        .catch((err) => alertaRef.current.addAlert(err));
    }
  };
  const aoAssociarPreceptor = (preceptor, atividadesLocal) => {
    if (atividadesLocal.length < 1)
      return alertaRef.current.addAlert(
        new Error("Nenhuma atividade selecionada")
      );
    if (atividadesLocal.some((al) => al.id_atividadelocal === null))
      return alertaRef.current.addAlert(
        new Error("Todas as atividades selecionadas devem possuir local")
      );

    const novosDados = atividadesLocal.map((al) => ({
      id_atividadelocal: al.id_atividadelocal,
      id_preceptor: preceptor.id_preceptor,
    }));

    console.log(novosDados);
    apiSFE
      .editarAtividadesLocal(usuario.token, novosDados)
      .then(() => setEstado(estado + 1))
      .catch((err) => alertaRef.current.addAlert(err));
  };

  const aoEditar = () => {
    setEditando(!editando);
  };

  return (
    <div className="row w-100 justify-content-center m-0">
      <div
        id="editar-selecionar"
        className="col-12 position-sticky top-0 bg-white z-1"
      >
        <BotaoTexto
          aoClicar={aoEditar}
          className="mb-2 me-3"
          texto={editando ? "Voltar" : "Editar"}
          visivel
        />
      </div>
      {!editando && associacoes.length < 1 ? (
        <div className="col-sm-5 fw-bold text-center text-danger">
          Nenhum registro encontrado.
        </div>
      ) : undefined}
      {!editando ? (
        <>
          <div className="col-sm-12 col-xl-8">
            {associacoes.map((associacao) => (
              <div
                className="mb-2 border-bottom border-4 border-primary"
                key={gerarChaveUnica()}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <span className="fs-5 fw-bold">
                    {associacao.nome_atividade}
                  </span>
                </div>
                <div className="row w-100 align-items-center pb-2 border-bottom m-0">
                  <div className="col-sm-8 p-0 mb-1">
                    <span>Local: </span>
                    <span className="fw-bold">{associacao.nome_local}</span>
                  </div>
                </div>
                <div className="row w-100 align-items-center pb-2 border-bottom m-0"></div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <PlanejamentoEditando
          ativsLocal={ativsLocal}
          locais={locais}
          estagios={estagios}
          grupos={grupos}
          preceptores={preceptores}
          aoAssociarAtividade={aoAssociarAtividade}
          aoAssociarPreceptor={aoAssociarPreceptor}
        />
      )}
    </div>
  );
}
