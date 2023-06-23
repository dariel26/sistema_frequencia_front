import { useState } from "react";
import BotaoDrop from "../../componentes/botoes/BotaoDrop";
import TabelaPadrao from "../../componentes/tabelas/TabelaPadrao";
import { gerarChaveUnica } from "../../utils";

export function PlanejamentoEditando({
  ativsLocal,
  locais,
  aoAssociarAtividade,
  aoAssociarPreceptor,
  grupos,
  preceptores,
  estagios,
}) {
  const [ativsLocalSelecionadas, setAtivsLocalSelecionadas] = useState([]);

  const associacoes = ativsLocal.filter((al) => al.id_atividadelocal !== null);

  const estagioAssociado = ({ id_atividade }) => {
    const estagio = estagios.find((e) =>
      e.atividades.some((a) => a.id_atividade === id_atividade)
    );
    return estagio;
  };
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
  const aoClicarAssociarPreceptor = (preceptor) => {
    aoAssociarPreceptor(preceptor, ativsLocalSelecionadas);
    setAtivsLocalSelecionadas([]);
  };
  const aoClicarAssociarLocal = (local) => {
    aoAssociarAtividade(local, ativsLocalSelecionadas);
    setAtivsLocalSelecionadas([]);
  };
  return (
    <>
      <div className="col-12 mt-2 mb-4 text-center">
        <h5>Locais e Preceptores / Professores</h5>
      </div>
      <div className="col-sm-12 col-xl-8 mb-4">
        <div className="row">
          <div className="col-sm-3 col-xxl-2 me-4 mb-1">
            <BotaoDrop
              textoBotao="Associar Local"
              dadosMenu={locais
                .map((l) => ({
                  texto: l.nome,
                  visible: true,
                  acao: () => aoClicarAssociarLocal(l),
                }))
                .concat([
                  {
                    texto: "Desassociar",
                    visible: true,
                    acao: () => aoClicarAssociarLocal({ id_local: null }),
                  },
                ])}
            />
          </div>
          <div className="col-sm-4">
            <BotaoDrop
              textoBotao="Associar Preceptor"
              dadosMenu={preceptores.map((p) => ({
                texto: p.nome,
                visible: true,
                acao: () => aoClicarAssociarPreceptor(p),
              }))}
            />
          </div>
        </div>
      </div>
      <div className="col-sm-12 col-xl-8 pb-4 border-bottom border-4">
        <TabelaPadrao
          aoClicar={(al) => selecionaAtivLocal(al)}
          numerado
          camposCabecalho={[
            { texto: "#", visivel: true },
            { texto: "Nome atividade", visivel: true },
            { texto: "Nome local", visivel: true },
            { texto: "Nome preceptor", visivel: true },
            { texto: "Selecionar", visivel: true },
          ]}
          dados={ativsLocal.map((al) => ({
            ...al,
            nome_local: al.nome_local === null ? "-" : al.nome_local,
            nome_preceptor:
              al.nome_preceptor === null ? "-" : al.nome_preceptor,
          }))}
          camposDados={[
            { texto: "nome_atividade", visivel: true },
            { texto: "nome_local", visivel: true },
            { texto: "nome_preceptor", visivel: true },
            {
              check: true,
              visivel: true,
              selecionado: (al) => ativLocalSelecionada(al),
            },
          ]}
        />
      </div>
      <div className="col-12 text-center mt-4 mb-4">
        <h5>Horarios e Alunos</h5>
      </div>
      <div className="col-sm-12 col-xl-8">
        {associacoes.map((associacao) => (
          <div
            className="mb-2 border-bottom border-4 border-primary"
            key={gerarChaveUnica()}
          >
            <div className="d-flex align-items-center justify-content-between">
              <span className="fs-5 fw-bold">{associacao.nome_atividade}</span>
            </div>
            <div className="row w-100 align-items-center pb-2 border-bottom m-0">
              <div className="col-sm-12 p-0 mb-1">
                <span>Local: </span>
                <span className="fw-bold">{associacao.nome_local}</span>
              </div>
              <div className="col-sm-12 p-0 mb-1">
                <span>Estagio: </span>
                <span className="fw-bold">
                  {estagioAssociado(associacao)
                    ? estagioAssociado(associacao).nome_estagio
                    : "Atividade Geral"}
                </span>
              </div>
              <div className="col-sm-12 p-0 mb-1">
                <span>Preceptor: </span>
                <span
                  className={`fw-bold ${
                    associacao.id_preceptor === null ? "text-danger" : ""
                  }`}
                >
                  {associacao.nome_preceptor
                    ? associacao.nome_preceptor
                    : "Nenhum"}
                </span>
              </div>
              {estagioAssociado(associacao) ? (
                estagioAssociado(associacao).grupos.map((g) => (
                  <div
                    className="row w-100 justify-content-center"
                    key={gerarChaveUnica()}
                  >
                    <div className="col-12 fs-6 fw-bold text-center">
                      {g.nome}
                    </div>
                  </div>
                ))
              ) : (
                <div>Outro</div>
              )}
            </div>
            <div className="row w-100 align-items-center pb-2 border-bottom m-0"></div>
          </div>
        ))}
      </div>
    </>
  );
}
