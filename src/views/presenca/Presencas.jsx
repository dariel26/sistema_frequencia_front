import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  BotaoTexto,
  CardSimples,
  TabelaPadrao,
  CardSimplesBarraFixa,
} from "../../componentes";
import apiSFE from "../../service/api";
import { SistemaContext, UsuarioContext } from "../../contexts";
import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { BiMapPin } from "react-icons/bi";
import {
  amdEmData,
  dataEmAmd,
  dataEmDmahm,
  diferencaAbsEmHoras,
  horarioEmData,
  errors,
} from "../../utils";
import PresencaAMarcar from "./PresencaAMarcar";
import { presencaEstados } from "../gerir_presenca/GerirPresencas";

export default function Presencas() {
  const [presencas, setPresencas] = useState([]);
  const [dataArarangua, setDataArarangua] = useState();
  const [presencaAMarcar, setPresencaAMarcar] = useState();
  const [coordenadas, setCoordenadas] = useState({ lat: null, lon: null });

  const { concorda, carregando, error, aviso } = useRef(
    useContext(SistemaContext)
  ).current;
  const usuario = useContext(UsuarioContext);

  const localiza = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (posicao) => {
          const { latitude, longitude } = posicao.coords;
          setCoordenadas({ lat: latitude, lon: longitude });
        },
        (_) => {
          setCoordenadas({ lat: null, lon: null });
          concorda(
            "Não foi possível acessar suas coordenadas. Tente fechar o aplicativo, verifique as configurações de permissão do aplicativo e abra-o novamente."
          );
        }
      );
    } else {
      aviso("O navegador usado não suporta geolocalização.");
    }
  }, [aviso, concorda]);

  useEffect(() => {
    carregando(true);
    if (usuario.id_usuario === undefined) return;
    apiSFE
      .buscarPresencasPorAluno(usuario.token, usuario.id_usuario)
      .then((res) => {
        setPresencas(
          res.data.presencas.map((p) => ({
            ...p,
            data: dataEmAmd(amdEmData(p.data)),
          }))
        );
        localiza();
        setDataArarangua(new Date(res.data.dataAtual));
      })
      .catch((err) => error(errors.filtraMensagem(err)))
      .finally(() => carregando(false));
  }, [usuario, error, localiza, concorda, carregando]);

  const aoClicarEmMarcar = (dado) => {
    setPresencaAMarcar(dado);
  };

  const atualiza = async () => {
    try {
      carregando(true);
      const res = await apiSFE.buscarPresencasPorAluno(
        usuario.token,
        usuario.id_usuario
      );
      setPresencas(
        res.data.presencas.map((p) => ({
          ...p,
          data: dataEmAmd(amdEmData(p.data)),
        }))
      );
      localiza();
      setDataArarangua(new Date(res.data.dataAtual));
    } catch (err) {
      error(errors.filtraMensagem(err));
    } finally {
      carregando(false);
    }
  };

  return (
    <CardSimples titulo={"Presenças"}>
      <Row className="w-100 m-0 justify-content-center">
        <CardSimplesBarraFixa>
          <BotaoTexto
            className="me-2"
            aoClicar={() => setPresencaAMarcar(undefined)}
            visivel={presencaAMarcar}
            texto="Cancelar"
          />
          <BotaoTexto
            texto="Atualizar"
            visivel
            aoClicar={atualiza}
            assincrono
          />
        </CardSimplesBarraFixa>
        <Col sm="12" className="mb-2 text-center">
          <span className="fs-5 fw-bold">
            {dataEmDmahm(dataArarangua)}{" "}
            <BiMapPin
              className={
                coordenadas.lat !== null && coordenadas.lon !== null
                  ? "ms-2 text-success"
                  : "ms-2 text-danger"
              }
              size={24}
            />
          </span>
        </Col>
        {presencaAMarcar ? (
          <PresencaAMarcar
            coordenadas={coordenadas}
            presenca={presencaAMarcar}
            setPresencas={setPresencas}
            aoCancelar={() => setPresencaAMarcar(undefined)}
          />
        ) : (
          <Col sm="12" xl="8">
            <TabelaPadrao
              camposCabecalho={[
                { texto: "Atividade", visivel: true },
                { texto: "Data", visivel: true },
                { texto: "Inicio", visivel: true },
                { texto: "Estado", visivel: true },
              ]}
              dados={presencas}
              camposDados={[
                { texto: "nome", visivel: true },
                { data: "data", visivel: true },
                { texto: "hora_inicial", visivel: true },
                {
                  funcaoComponente: (dado) => {
                    const dataAtividade = horarioEmData(
                      amdEmData(dado.data),
                      dado.hora_inicial
                    );
                    const diferencaEmHoras = diferencaAbsEmHoras(
                      dataArarangua,
                      dataAtividade
                    );

                    const dataPassou = diferencaEmHoras < -2;
                    const muitoCedo = diferencaEmHoras > 0.3;

                    return dado.excluida === 1 ? (
                      "Livre"
                    ) : dado.estado === presencaEstados.PRESENTE ? (
                      "Presente"
                    ) : dado.estado === presencaEstados.CRIADA && dataPassou ? (
                      "Faltou"
                    ) : dado.estado === presencaEstados.CRIADA && muitoCedo ? (
                      "Espera"
                    ) : dado.estado === presencaEstados.ATESTADO ? (
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip>Presença marcada com atestado.</Tooltip>
                        }
                      >
                        <span className="fw-bold text-primary">Atestado</span>
                      </OverlayTrigger>
                    ) : dado.estado === presencaEstados.REJEITADA ? (
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Um superior marcou a falta.</Tooltip>}
                      >
                        <span className="text-danger fw-bold">Rejeitada</span>
                      </OverlayTrigger>
                    ) : (
                      <label
                        role="button"
                        className="text-primary fw-bold"
                        onClick={() => aoClicarEmMarcar(dado)}
                      >
                        Marcar
                      </label>
                    );
                  },
                  visivel: true,
                },
              ]}
            />
          </Col>
        )}
      </Row>
    </CardSimples>
  );
}
