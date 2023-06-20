import CardDefault from "../components/cards/CardDefault";
import { AiOutlineDelete } from "react-icons/ai";
import { useRef, useState } from "react";
import { useEffect } from "react";
import apiSFE from "../service/api";
import { useContext } from "react";
import { UsuarioContext } from "../filters/User";
import { AlertaContext } from "../filters/alert/Alert";
import Map from "../components/map/Map";
import { useCallback } from "react";

export default function Places() {
  const [places, setPlaces] = useState([]);
  const [latlng, setLatlng] = useState({});
  const [name, setName] = useState("");
  const [refresh, setRefresh] = useState(0);

  const usuario = useContext(UsuarioContext);
  const alertaRef = useRef(useContext(AlertaContext));

  let styleInput = {
    display: latlng.lat !== undefined ? "flex" : "none",
    position: "absolute",
    maxWidth: "400px",
    width: "50%",
    top: "478px",
    right: "0px",
    zIndex: "9999",
  };

  useEffect(() => {
    apiSFE
      .listaLugares(usuario.token)
      .then((res) => {
        setPlaces(
          res.data.map((p) => ({
            nome: p.nome,
            id_local: p.id_local,
            coordenadas: [p.coordenadas.lat, p.coordenadas.lon],
          }))
        );
      })
      .catch((err) => {
        alertaRef.current.addAlert(err);
      });
  }, [usuario, refresh]);

  const onSelectMap = useCallback((latlng) => {
    setLatlng(latlng);
  }, []);

  const onDelete = (place) => {
    apiSFE
      .deletaLugar(usuario.token, place.id_local)
      .then(() => setRefresh((refresh) => refresh + 1))
      .catch((err) => alertaRef.addAlert(err));
  };

  const onAdd = () => {
    if (latlng.lat === undefined || name === "") return;
    const newPlace = {
      nome: name,
      coordenadas: JSON.stringify({ lat: latlng.lat, lon: latlng.lng }),
    };
    apiSFE
      .adicionaLugar(usuario.token, newPlace)
      .then(() => {
        setName("");
        setLatlng({});
        setRefresh((refresh) => refresh + 1);
      })
      .catch((err) => alertaRef.addAlert(err));
  };

  return (
    <CardDefault title="Locais">
      <Map places={places} onSelectMap={onSelectMap} />
      <div className="input-group mb-3 me-3" style={styleInput}>
        <input
          type="text"
          className="form-control"
          placeholder="Dê um nome ao local"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn btn-primary" type="button" onClick={onAdd}>
          Adicionar
        </button>
      </div>
      <table className="table table-striped table-hover">
        <thead>
          <tr className="text-center">
            <th scope="col">Nome</th>
            <th scope="col">Coordenadas</th>
            <th scope="col">Deletar</th>
          </tr>
        </thead>
        <tbody>
          {places?.map((p) => (
            <tr className="text-center align-middle" key={p.id_local}>
              <td>{p.nome}</td>
              <td>{`lat: ${p.coordenadas[0]} | lon:  ${p.coordenadas[1]}`}</td>
              <td>
                <button className="btn text-danger" onClick={() => onDelete(p)}>
                  <AiOutlineDelete size={22} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardDefault>
  );
}
