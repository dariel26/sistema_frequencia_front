import { useContext, useEffect, useRef, useState } from "react";
import { CardSimples, TabelaPadrao } from "../../componentes";
import { UsuarioContext } from "../../filters/Usuario";
import apiSFE from "../../service/api";
import { AlertaContext } from "../../filters/alerta/Alerta";
import { Col, Row } from "react-bootstrap";
import {
  amdEmData,
  dataEmAmd,
  dataEmDmahm,
  diferencaAbsEmHoras,
  horarioEmData,
} from "../../utils/datas";
import PresencaAMarcar from "./PresencaAMarcar";

export default function Presencas() {
  const [presencas, setPresencas] = useState([]);
  const [dataArarangua, setDataArarangua] = useState();
  const [presencaAMarcar, setPresencaAMarcar] = useState();

  const usuario = useContext(UsuarioContext);
  const alerta = useRef(useContext(AlertaContext)).current;

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
        const { year, month, day, hours, minutes } = res.data.dataHora;
        setDataArarangua(new Date(year, month - 1, day, hours, minutes));
      })
      .catch((err) => alerta.adicionaAlerta(err));
  }, [usuario, alerta]);

  const aoClicarEmMarcar = (dado) => {
    setPresencaAMarcar(dado);
  };

  return (
    <CardSimples titulo={"Presenças"}>
      <Row className="w-100 m-0 justify-content-center">
        <Col sm="12" className="mb-2 text-center">
          <span className="fs-5 fw-bold">{dataEmDmahm(dataArarangua)}</span>
        </Col>
        {presencaAMarcar ? (
          <PresencaAMarcar
            presenca={presencaAMarcar}
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

                    return dado.estado === 1 ? (
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
