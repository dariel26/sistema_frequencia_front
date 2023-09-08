import { useState, useContext, useEffect, useRef } from "react";
import { AlertaContext } from "../../../filters/alerta/Alerta";
import apiSFE from "../../../service/api";
import { UsuarioContext } from "../../../filters/Usuario";
import "react-datepicker/dist/react-datepicker.css";
import InputBotao from "../../../componentes/inputs/InputBotao";
import BotaoTexto from "../../../componentes/botoes/BotaoTexto";
import DivCabecalhoDeletar from "../../../componentes/divs/DivCabecalhoDeletar";
import { gerarChaveUnica } from "../../../utils";
import TabelaPadrao from "../../../componentes/tabelas/TabelaPadrao";
import { CardRadiosBarraFixa } from "../../../components/cards/CardRadios";
import EstagiosEdicao from "./EstagiosEdicao";
import { SistemaContext } from "../../../filters/sistema/Sistema";

export default function Estagios() {
  const [estagios, setEstagios] = useState([]);
  const [editando, setEditando] = useState(false);

  const { carregando } = useRef(useContext(SistemaContext)).current;
  const alerta = useRef(useContext(AlertaContext)).current;
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
      .catch((err) => {
        alerta.adicionaAlerta(err);
      })
      .finally(() => carregando(false));
  }, [token, alerta, carregando]);

  const aoAdicionarEstagio = async (nome) => {
    try {
      const res = await apiSFE.adicionarEstagios(token, [{ nome }]);
      setEstagios(res.data);
      return "Estágio salvo!";
    } catch (err) {
      throw err;
    }
  };

  const aoDeletarEstagio = async ({ id_estagio }) => {
    try {
      const ids = [id_estagio];
      await apiSFE.deletarEstagios(token, ids);
      setEstagios((existentes) =>
        existentes.filter((e) => e.id_estagio !== id_estagio)
      );
      return "Estágio deletado!";
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="row w-100 justify-content-center m-0">
      <CardRadiosBarraFixa>
        <BotaoTexto
          aoClicar={() => setEditando(!editando)}
          className="mb-2 me-3"
          texto={editando ? "Voltar" : "Editar"}
          visivel={!nenhumEstagioSalvo}
        />
      </CardRadiosBarraFixa>
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
                  <div className="mb-2" key={gerarChaveUnica()}>
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
