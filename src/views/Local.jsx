import { MdDeleteForever } from "react-icons/md";
import { useRef, useState } from "react";
import { useEffect } from "react";
import apiSFE from "../service/api";
import { useContext } from "react";
import { UsuarioContext } from "../filters/Usuario";
import { AlertaContext } from "../filters/alerta/Alerta";
import { useCallback } from "react";
import CardSimples from "../componentes/cards/CardSimples";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import TabelaPadrao from "../componentes/tabelas/TabelaPadrao";
import Mapa from "../componentes/mapa/Mapa";

const latLonInicial = { lat: "", lon: "" };

export default function Local() {
  const [locais, setLocais] = useState([]);
  const [latLon, setLatLon] = useState(latLonInicial);
  const [salvando, setSalvando] = useState(false);
  const [idLocalDeletando, setIdLocalDeletando] = useState(undefined);
  const [nome, setNome] = useState("");

  const usuario = useContext(UsuarioContext);
  const alerta = useRef(useContext(AlertaContext)).current;

  const token = usuario.token;
  const camposInvalidos = latLon.lat === "" || latLon.lon === "" || nome === "";

  const preencherLocais = useCallback((bdLocais) => {
    setLocais(
      bdLocais.map((p) => ({
        nome: p.nome,
        id_local: p.id_local,
        coordenadas: [p.coordenadas.lat, p.coordenadas.lon],
      }))
    );
  }, []);

  useEffect(() => {
    apiSFE
      .listarLocais(token)
      .then((res) => {
        preencherLocais(res.data);
      })
      .catch((err) => {
        alerta.adicionaAlerta(err);
      });
  }, [token, preencherLocais, alerta]);

  const aoClicarNoMapa = useCallback(({ lat, lng }) => {
    setLatLon({ lat, lon: lng });
  }, []);

  const aoDeletar = (local) => {
    setIdLocalDeletando(local.id_local);
    apiSFE
      .deletarLocais(token, [local.id_local])
      .then(() =>
        setLocais((existentes) =>
          existentes.filter((l) => l.id_local !== local.id_local)
        )
      )
      .catch((err) => alerta.adicionaAlerta(err))
      .finally(() => setIdLocalDeletando(undefined));
  };

  const aoAdicionar = (e) => {
    e.preventDefault();
    if (camposInvalidos) return;
    const novoLocal = {
      nome: nome,
      coordenadas: JSON.stringify({ lat: latLon.lat, lon: latLon.lon }),
    };
    setSalvando(true);
    apiSFE
      .adicionarLocais(usuario.token, [novoLocal])
      .then((res) => {
        setNome("");
        setLatLon(latLon);
        preencherLocais(res.data);
      })
      .catch((err) => alerta.adicionaAlerta(err))
      .finally(() => setSalvando(false));
  };

  return (
    <CardSimples titulo="Locais">
      <Row className="m-0 justify-content-center w-100">
        <Col
          sm="12"
          xl="8"
          className="mb-3 border border-4 border-primary p-0 rounded"
        >
          <Mapa locais={locais} aoClicar={aoClicarNoMapa} />
        </Col>
        <Col sm="12" xl="8">
          <Form className="align-items-end row" onSubmit={aoAdicionar}>
            <Col sm="4" xl="4" className="mb-2">
              <Form.Label htmlFor="Local">Nome do local</Form.Label>
              <Form.Control
                id="Local"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </Col>
            <Col sm="4" xl="3" className="mb-2">
              <Form.Label htmlFor="Lat">Latitude</Form.Label>
              <Form.Control
                id="Lat"
                value={latLon.lat}
                onChange={(e) =>
                  setLatLon({ lat: e.target.value, lon: latLon.lon })
                }
              />
            </Col>
            <Col sm="4" xl="3" className="mb-2">
              <Form.Label htmlFor="Lon">Longitude</Form.Label>
              <Form.Control
                id="Lon"
                value={latLon.lon}
                onChange={(e) =>
                  setLatLon({ lon: e.target.value, lat: latLon.lat })
                }
              />
            </Col>
            <Col sm="4" xl="2" className="mb-2">
              <Button type="submit" disabled={camposInvalidos}>
                {salvando && (
                  <Spinner size="sm" animation="grow" className="me-2" />
                )}
                Adicionar
              </Button>
            </Col>
          </Form>
        </Col>
        <Col sm="12" xl="8">
          <TabelaPadrao
            numerado
            camposCabecalho={[
              { texto: "#", visivel: true },
              { texto: "Nome", visivel: true },
              { texto: "Deletar", visivel: true },
            ]}
            dados={locais}
            camposDados={[
              { texto: "nome", visivel: true },
              {
                funcaoComponente: (local) => (
                  <label
                    role="button"
                    onClick={() => aoDeletar(local)}
                    className="w-100"
                  >
                    {idLocalDeletando === local.id_local ? (
                      <Spinner animation="grow" size="sm" />
                    ) : (
                      <MdDeleteForever size={21} color="var(--bs-dark)" />
                    )}
                  </label>
                ),
                visivel: true,
              },
            ]}
          />
        </Col>
      </Row>
    </CardSimples>
  );
}
