import { useState } from "react";
import { useContext } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { AlertContext } from "../../filters/alert/Alert";
import { Typeahead } from "react-bootstrap-typeahead";
import apiSFE from "../../service/api";
import { UserContext } from "../../filters/User";
import { AiOutlineDelete } from "react-icons/ai";

export default function Grupos() {
  const [grupos, setGrupos] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [selectValue, setSelectValue] = useState({});
  const [reset, setReset] = useState(0);
  const [name, setName] = useState("");

  const alert = useContext(AlertContext);
  const user = useContext(UserContext);

  const addAlert = useCallback(
    (err, message) => {
      alert.addAlert(err, message);
    },
    [alert]
  );

  useEffect(() => {
    const token = user.infoUser.token;
    const p_grupos = apiSFE.listaGrupos(token);
    const p_alunos = apiSFE.listaAluno(token);
    Promise.all([p_grupos, p_alunos])
      .then((res) => {
        const grupos = res[0].data;
        const alunos = res[1].data;
        setGrupos(grupos);
        setAlunos(alunos);
      })
      .catch((err) => {
        addAlert(err);
      });
  }, [addAlert, user, reset]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (name === undefined || name === "") return;
    const token = localStorage.getItem("token");
    const novoGrupo = { nome: name };
    apiSFE
      .adicionaGrupo(token, novoGrupo)
      .then(() => {
        setReset((reset) => reset + 1);
      })
      .catch((err) => addAlert(err));
  };

  const onSelect = (alunos) => {
    setSelectValue(alunos[0]);
  };

  const alunosDisponiveis = (grupo) => {
    let alunosDisponiveis = alunos;
    const outrosGrupos = grupos.filter(
      (g) => g.nome_grupo !== grupo.nome_grupo
    );
    for (let g of outrosGrupos) {
      for (let a of g.alunos) {
        alunosDisponiveis = alunosDisponiveis.filter(
          (aluno) => aluno.matricula !== a.matricula
        );
      }
    }
    return alunosDisponiveis;
  };

  const onRemoveGrupo = (grupo) => {
    const token = user.infoUser.token;
    apiSFE
      .removeGrupo(token, grupo.id_grupo)
      .then(() => {
        setReset((reset) => reset + 1);
      })
      .catch((err) => addAlert(err));
  };

  const onAdd = (grupo) => {
    let id_grupo = grupo.id_grupo;
    if (selectValue?.matricula === undefined) return;
    if (grupo.alunos.find((a) => a.matricula === selectValue.matricula))
      id_grupo = null;
    apiSFE
      .incluirEmGrupo(user.infoUser.token, selectValue.matricula, id_grupo)
      .then(() => {
        setReset((reset) => reset + 1);
      })
      .catch((err) => {
        addAlert(err);
      });
  };

  return (
    <div className="d-flex w-100 h-100 flex-column p-2">
      {grupos.map((g) => (
        <div className="mb-5 border-bottom border-4 border-primary" key={g.nome_grupo}>
          <div className="d-flex align-items-center">
            <span className="fs-4">{g.nome_grupo}</span>
            <button
              className="btn btn-danger ms-4 p-1"
              onClick={() => onRemoveGrupo(g)}
            >
              <AiOutlineDelete size={25} />
            </button>
          </div>

          <form className="col-sm-4 p-1">
            <label className="ms-2">Escolha integrantes</label>
            <div className="d-flex">
              <Typeahead
                id="typeahead-alunos"
                labelKey={"nome"}
                emptyLabel="Nenhum aluno encontrado"
                onChange={onSelect}
                options={alunosDisponiveis(g)}
              />
              <button
                className="btn ms-1 border-primary text-primary"
                onClick={(e) => {
                  e.preventDefault();
                  onAdd(g);
                }}
              >
                Adiciona/Remove
              </button>
            </div>
          </form>

          <table className="table table-striped table-hover">
            <thead>
              <tr className="text-center">
                <th scope="col">Integrantes</th>
                <th scope="col">Matricula</th>
                <th scope="col">Nome</th>
              </tr>
            </thead>
            <tbody>
              {g?.alunos?.map((a, index) => (
                <tr className="text-center align-middle" key={a.matricula}>
                  <td>{index + 1}</td>
                  <td>{a.matricula}</td>
                  <td>{a.nome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      <div
        className="input-group m-2"
        style={{ height: "40px", maxWidth: "300px" }}
      >
        <input
          type="text"
          className="form-control"
          placeholder="Nome do grupo"
          aria-describedby="button-addon2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn btn-primary" type="button" onClick={onSubmit}>
          Criar
        </button>
      </div>
    </div>
  );
}
