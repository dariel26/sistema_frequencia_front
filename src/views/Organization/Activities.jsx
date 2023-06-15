import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../filters/User";
import { AlertContext } from "../../filters/alert/Alert";
import apiSFE from "../../service/api";
import { AiOutlineDelete } from "react-icons/ai";

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
  }, [user, reset]);

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

  const onDeleteAtividade = (atividade) => {
    apiSFE
      .deletarAtividade(user.infoUser.token, atividade.id_atividade)
      .then(() => setReset((reset) => reset + 1))
      .catch((err) => alert.current.addAlert());
  };

  return (
    <div className="d-flex w-100 h-100 flex-column p-2">
      {estagios.map((estagio) => (
        <div
          className="mb-5 border-bottom border-4 border-primary"
          key={estagio.id_estagio}
        >
          <div className="d-flex">
            <span className="fs-4 border-bottom mb-2">
              {estagio.nome_estagio}
            </span>
          </div>
          <div className="row w-100 align-items-center pb-2 border-bottom m-0">
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
            <table className="table table-striped table-hover">
              <thead>
                <tr className="text-center">
                  <th scope="col">Nome</th>
                  <th scope="col">Deletar</th>
                </tr>
              </thead>
              <tbody>
                {estagio?.atividades?.map((atividade) => (
                  <tr
                    className="text-center align-middle"
                    key={atividade.id_atividade}
                  >
                    <td>{atividade.nome}</td>
                    <td>
                      <button
                        className="btn text-danger"
                        onClick={() => onDeleteAtividade(atividade, estagio)}
                      >
                        <AiOutlineDelete size={22} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
