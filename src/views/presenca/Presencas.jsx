import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { BotaoTexto, CardSimples, TabelaPadrao } from "../../componentes";
import { UsuarioContext } from "../../filters/Usuario";
import apiSFE from "../../service/api";
import { AlertaContext } from "../../filters/alerta/Alerta";
import { Col, Row } from "react-bootstrap";
import { BiMapPin } from "react-icons/bi";
import {
  amdEmData,
  dataEmAmd,
  dataEmDmahm,
  diferencaAbsEmHoras,
  horarioEmData,
} from "../../utils/datas";
import PresencaAMarcar from "./PresencaAMarcar";
import { CardSimplesBarraFixa } from "../../componentes/cards/CardSimples";

export default function Presencas() {
  const [presencas, setPresencas] = useState([]);
  const [dataArarangua, setDataArarangua] = useState();
  const [presencaAMarcar, setPresencaAMarcar] = useState();
  const [coordenadas, setCoordenadas] = useState({ lat: null, lon: null });

  const usuario = useContext(UsuarioContext);
  const alerta = useRef(useContext(AlertaContext)).current;

  const localiza = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (posicao) => {
          const { latitude, longitude } = posicao.coords;
          setCoordenadas({ lat: latitude, lon: longitude });
        },
        (_) => {
          alerta.adicionaAlerta(
            new Error("Não foi possível obter a posição geográfica do usuário")
          );
        }
      );
    } else {
      alerta.adicionaAlerta(
        new Error("O navegador usado, não suporta geolocalização")
      );
    }
  }, [alerta]);

  useEffect(() => {
    if (usuario.id === undefined) return;
    apiSFE
      .buscarPresencasPorAluno(usuario.token, usuario.id)
      .then((res) => {
        setPresencas(
          res.data.presencas.map((p) => ({
            ...p,
            data: dataEmAmd(amdEmData(p.data)),
          }))
        );
        localiza();
        const { year, month, day, hours, minutes } = res.data.dataHora;
        setDataArarangua(new Date(year, month - 1, day, hours, minutes));
      })
      .catch((err) => alerta.adicionaAlerta(err));
  }, [usuario, alerta, localiza]);

  const aoClicarEmMarcar = (dado) => {
    setPresencaAMarcar(dado);
  };

  const atualiza = async () => {
    try {
      const res = await apiSFE.buscarPresencasPorAluno(
        usuario.token,
        usuario.id
      );
      setPresencas(
        res.data.presencas.map((p) => ({
          ...p,
          data: dataEmAmd(amdEmData(p.data)),
        }))
      );
      localiza();
      const { year, month, day, hours, minutes } = res.data.dataHora;
      setDataArarangua(new Date(year, month - 1, day, hours, minutes));
    } catch (err) {
      alerta.adicionaAlerta(err);
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
                    ) : dado.estado === "1" ? (
                      "Presente"
                    ) : dataPassou ? (
                      "Faltou"
                    ) : muitoCedo ? (
                      "Espera"
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
