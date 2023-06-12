import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../filters/User";
import { AlertContext } from "../../filters/alert/Alert";
import apiSFE from "../../service/api";

export default function Activities() {
  const [estagios, setEstagios] = useState([]);
  const [name, setName] = useState({});
  const [reset, setReset] = useState(0);

  const user = useContext(UserContext);
  const alert = useRef(useContext(AlertContext));
  useEffect(() => {
    const token = user.infoUser.token;
    const p_estagios = apiSFE.listaEstagios(token);
    Promise.all([p_estagios])
      .then((res) => {
        const estagios = res[0].data;
        setEstagios(estagios);
      })
      .catch((err) => {
        alert.current.addAlert(err);
      });
  }, [alert, user, reset]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (name.name === undefined || name.name === "") return;
    const token = user.infoUser.token;
    const novaAtividade = { nome: name.name, id_estagio: name.id_estagio };
    apiSFE
      .adicionaAtividade(token, novaAtividade)
      .then(() => {
        setReset((reset) => reset + 1);
      })
      .catch((err) => alert.current.addAlert(err));
  };

  return (
    <div className="d-flex w-100 h-100 flex-column p-2">
      {estagios.map((estagio) => (
        <div
          className="mb-5 border-bottom border-4 border-primary"
          key={estagio.id_estagio}
        >
          <div className="d-flex align-items-center">
            <span className="fs-4 border-bottom mb-2">
              {estagio.nome_estagio}
            </span>
          </div>
          {estagio?.atividades?.map((atividade) => (
            <div key={atividade.id_atividade}>{atividade.nome}</div>
          ))}
          <div
            className="input-group m-2"
            style={{ height: "40px", maxWidth: "300px" }}
          >
            <input
              type="text"
              className="form-control"
              placeholder="Nome da atividade"
              aria-describedby="button-addon2"
              value={name.id_estagio === estagio.id_estagio ? name.name : ""}
              onChange={(e) =>
                setName({
                  id_estagio: estagio.id_estagio,
                  name: e.target.value,
                })
              }
            />
            <button
              className="btn btn-primary"
              type="button"
              onClick={onSubmit}
            >
              Criar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
