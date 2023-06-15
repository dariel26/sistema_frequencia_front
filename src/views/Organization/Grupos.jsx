import { useState, useContext, useEffect, useRef } from "react";
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

  const alert = useRef(useContext(AlertContext));
  const user = useContext(UserContext);

  const alunosDisponiveis = alunos.filter((a) => a.id_grupo === null);

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
        alert.current.addAlert(err);
      });
  }, [user, reset]);

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
      .catch((err) => alert.current.addAlert(err));
  };

  const onSelect = (alunos) => {
    setSelectValue(alunos[0]);
  };

  const onRemoveGrupo = (grupo) => {
    const token = user.infoUser.token;
    apiSFE
      .removeGrupo(token, grupo.id_grupo)
      .then(() => {
        setReset((reset) => reset + 1);
      })
      .catch((err) => alert.current.addAlert(err));
  };

  const onDeleteAluno = (aluno) => {
    apiSFE
      .incluirEmGrupo(user.infoUser.token, aluno.matricula, null)
      .then(() => {
        setReset((reset) => reset + 1);
      })
      .catch((err) => {
        alert.current.addAlert(err);
      });
  };

  const onAdd = (grupo) => {
    let id_grupo = grupo.id_grupo;
    if (selectValue?.matricula === undefined) return;
    apiSFE
      .incluirEmGrupo(user.infoUser.token, selectValue.matricula, id_grupo)
      .then(() => {
        setReset((reset) => reset + 1);
      })
      .catch((err) => {
        alert.current.addAlert(err);
      });
  };

  return (
    <div className="d-flex w-100 h-100 flex-column p-2">
      {grupos.map((g) => (
        <div
          className="mb-5 border-bottom border-4 border-primary"
          key={g.nome_grupo}
        >
          <div className="d-flex align-items-center">
            <span className="fs-5 fw-bold border-bottom">{g.nome_grupo}</span>
            <button
              className="btn btn-danger ms-4 p-1"
              onClick={() => onRemoveGrupo(g)}
            >
              <AiOutlineDelete size={23} />
            </button>
          </div>

          <form className="col-sm-4 p-1 mt-2">
            <label className="ms-2">Escolha integrantes</label>
            <div className="d-flex">
              <Typeahead
                id="typeahead-alunos"
                labelKey={"nome"}
                emptyLabel="Nenhum aluno encontrado"
                onChange={onSelect}
                options={alunosDisponiveis}
              />
              <button
                className="btn ms-1 border-primary text-primary"
                onClick={(e) => {
                  e.preventDefault();
                  onAdd(g);
                }}
              >
                Adicionar
              </button>
            </div>
          </form>

          <table className="table table-striped table-hover">
            <thead>
              <tr className="text-center">
                <th scope="col">Integrantes</th>
                <th scope="col">Matricula</th>
                <th scope="col">Nome</th>
                <th scope="col">Deletar</th>
              </tr>
            </thead>
            <tbody>
              {g?.alunos?.map((a, index) => (
                <tr className="text-center align-middle" key={a.matricula}>
                  <td>{index + 1}</td>
                  <td>{a.matricula}</td>
                  <td>{a.nome}</td>
                  <td>
                    <button
                      className="btn text-danger"
                      onClick={() => onDeleteAluno(a)}
                    >
                      <AiOutlineDelete size={22} />
                    </button>
                  </td>
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
