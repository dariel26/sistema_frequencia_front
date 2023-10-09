import { useState, useContext, useEffect, useRef } from "react";
import apiSFE from "../../../service/api";
import { UsuarioContext, SistemaContext } from "../../../contexts";
import "react-datepicker/dist/react-datepicker.css";
import EstagiosEdicao from "./EstagiosEdicao";
import {
  CardLinksBarraFixa,
  TabelaPadrao,
  DivCabecalhoDeletar,
  BotaoTexto,
  InputBotao,
} from "../../../componentes";
import uuid from "react-uuid";
import { errors } from "../../../utils";

export default function Estagios() {
  const [estagios, setEstagios] = useState([]);
  const [editando, setEditando] = useState(false);

  const { carregando, error, confirma } = useRef(
    useContext(SistemaContext)
  ).current;
  const usuario = useContext(UsuarioContext);
  const token = usuario.token;

  const nenhumEstagioSalvo = estagios.length === 0;

  useEffect(() => {
    carregando(true);
    apiSFE
      .listarEstagios(token)
      .then((res) => {
        const estagios = res.data;
        setEstagios(estagios);
      })
      .catch((err) => error(errors.filtraMensagem(err)))
      .finally(() => carregando(false));
  }, [token, error, carregando]);

  const aoAdicionarEstagio = async (nome) => {
    try {
      const res = await apiSFE.adicionarEstagios(token, [{ nome }]);
      setEstagios(res.data);
    } catch (err) {
      throw err;
    }
  };

  const aoDeletarEstagio = async ({ id_estagio }) => {
    const resposta = await confirma(
      `Ao excluir este estágio, as atividades ligadas a
       ele serão excluidas, assim como todos os dados 
       ligados às atividades.`
    );
    if (!resposta) return;
    try {
      const ids = [id_estagio];
      await apiSFE.deletarEstagios(token, ids);
      setEstagios((existentes) =>
        existentes.filter((e) => e.id_estagio !== id_estagio)
      );
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="row w-100 justify-content-center m-0">
      <CardLinksBarraFixa>
        <BotaoTexto
          aoClicar={() => setEditando(!editando)}
          className="mb-2 me-3"
          texto={editando ? "Voltar" : "Editar"}
          visivel={!nenhumEstagioSalvo}
        />
      </CardLinksBarraFixa>
      {!editando ? (
        <>
          <div className="col-sm-12 col-xl-8">
            {estagios?.map(
              ({ nome_coordenador, nome_estagio, grupos, id_estagio }) => {
                const estagioSemCoordenador = nome_coordenador === null;
                const colorSpan = estagioSemCoordenador ? "text-danger" : "";
                const textSpan = estagioSemCoordenador
                  ? "Nenhum"
                  : nome_coordenador;
                return (
                  <div className="mb-2" key={uuid()}>
                    <DivCabecalhoDeletar
                      textoBotao="Deletar Estagio"
                      titulo={nome_estagio}
                      aoDeletar={() => aoDeletarEstagio({ id_estagio })}
                    >
                      <div className="row w-100 align-items-center pb-2 border-bottom m-0">
                        <div className="col-sm-8 p-0 mb-1">
                          <span>Coordenador: </span>
                          <span className={`fw-bold ${colorSpan}`}>
                            {textSpan}
                          </span>
                        </div>
                      </div>
                      <TabelaPadrao
                        numerado
                        camposCabecalho={[
                          { texto: "Rodízio", visivel: true },
                          { texto: "Grupo", visivel: true },
                          { texto: "Data inicial", visivel: true },
                          { texto: "Data final", visivel: true },
                        ]}
                        dados={grupos}
                        camposDados={[
                          { texto: "nome", visivel: true },
                          { data: "data_inicial", visivel: true },
                          { data: "data_final", visivel: true },
                        ]}
                      />
                    </DivCabecalhoDeletar>
                  </div>
                );
              }
            )}
          </div>
          <div className="col-sm-12 col-xl-8 mt-5 mb-5">
            <InputBotao
              textoReferencia={"Nome do estágio"}
              maximaLargura={300}
              aoClicar={aoAdicionarEstagio}
            />
          </div>
        </>
      ) : (
        <EstagiosEdicao estagios={estagios} setEstagios={setEstagios} />
      )}
    </div>
  );
}
