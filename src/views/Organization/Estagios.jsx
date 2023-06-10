import { useState } from "react";
import { useContext } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { AlertContext } from "../../filters/alert/Alert";
import apiSFE from "../../service/api";
import { Typeahead } from "react-bootstrap-typeahead";
import { UserContext } from "../../filters/User";
import { AiOutlineDelete } from "react-icons/ai";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ptBR from "date-fns/locale/pt-BR";

export default function Estagios() {
  const [estagios, setEstagios] = useState([]);
  const [coordenadores, setCoordenadores] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [selectCoordenador, setSelectCoordenador] = useState({});
  const [selectGrupo, setSelectGrupo] = useState({});
  const [reset, setReset] = useState(0);
  const [name, setName] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState({
    index: null,
    dates: [null, null],
  });

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
    const p_estagios = apiSFE.listaEstagios(token);
    const p_coordenadores = apiSFE.listaCoordenadores(token);
    const p_grupos = apiSFE.listaGrupos(token);
    Promise.all([p_estagios, p_coordenadores, p_grupos])
      .then((res) => {
        const estagios = res[0].data;
        const coordenadores = res[1].data;
        const grupos = res[2].data;
        setEstagios(estagios);
        setCoordenadores(coordenadores);
        setGrupos(grupos);
      })
      .catch((err) => {
        addAlert(err);
      });
  }, [addAlert, user, reset]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (name === undefined || name === "") return;
    const token = user.infoUser.token;
    const novoEstagio = { nome: name };
    apiSFE
      .adicionaEstagio(token, novoEstagio)
      .then(() => {
        setReset((reset) => reset + 1);
      })
      .catch((err) => addAlert(err));
  };

  const onSelectCoord = (coordenadores) => {
    setSelectCoordenador(coordenadores[0]);
  };

  const onRemoveEstagio = (estagio) => {
    const token = user.infoUser.token;
    apiSFE
      .removeEstagio(token, estagio.id_estagio)
      .then(() => {
        setReset((reset) => reset + 1);
      })
      .catch((err) => addAlert(err));
  };

  const onSelectGrupo = (grupos) => {
    setSelectGrupo(grupos[0]);
  };

  const handleDateChange = (index, dates) => {
    setSelectedDateRange({ index, dates });
  };

  const onChange = (estagio) => {
    let id_estagio = estagio.id_estagio;
    if (selectCoordenador?.email === undefined) return;
    apiSFE
      .trocarCoordenadorEstagio(
        user.infoUser.token,
        id_estagio,
        selectCoordenador.id_coordenador
      )
      .then(() => {
        setReset((reset) => reset + 1);
      })
      .catch((err) => {
        addAlert(err);
      });
  };

  const onAddRemoveGroup = (estagio) => {
    if (selectGrupo?.nome_grupo === undefined) return;
    const estagioGrupo = {
      id_estagio: estagio.id_estagio,
      id_grupo: selectGrupo.id_grupo,
      data_inicio: selectedDateRange.dates[0],
      data_final: selectedDateRange.dates[1],
    };
    if (estagio.grupos.find((g) => g.nome === selectGrupo.nome_grupo)) {
      apiSFE
        .desAssociarGrupoEstagio(
          user.infoUser.token,
          selectGrupo.id_grupo,
          estagio.id_estagio
        )
        .then(() => {
          setReset((reset) => reset + 1);
        })
        .catch((err) => {
          addAlert(err);
        });
    } else {
      if (selectedDateRange[0] === null || selectedDateRange[1] === null)
        return;
      apiSFE
        .associarGrupoEstagio(user.infoUser.token, estagioGrupo)
        .then(() => {
          setReset((reset) => reset + 1);
        })
        .catch((err) => {
          addAlert(err);
        });
    }
  };

  return (
    <div className="d-flex w-100 h-100 flex-column p-2">
      {estagios.map((estagio, i) => (
        <div className="mb-5 border-bottom border-4 border-primary" key={estagio.id_estagio}>
          <div className="d-flex align-items-center">
            <span className="fs-4">{estagio.nome_estagio}</span>
            <button
              className="btn btn-danger ms-4 p-1"
              onClick={() => onRemoveEstagio(estagio)}
            >
              <AiOutlineDelete size={25} />
            </button>
          </div>
          <div className="row w-100 align-items-center pb-2 border-bottom m-0">
            <div className="col-sm-8">
              <span>Coordenador: </span>
              <span className={`fw-bold ${estagio.nome_coordenador === null?"text-danger":""}`}>
                {estagio.nome_coordenador === null
                  ? "Nenhum"
                  : estagio.nome_coordenador}
              </span>
            </div>
            <form className="col-sm-4 p-1">
              <label className="ms-2">Coordenador</label>
              <div className="d-flex">
                <Typeahead
                  id="typeahead-coordenadores"
                  placeholder="Escolha o coordenador"
                  labelKey={"nome"}
                  emptyLabel="Nenhum coordenador encontrado"
                  onChange={onSelectCoord}
                  options={coordenadores}
                />
                <button
                  className="btn ms-1 border-primary text-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    onChange(estagio);
                  }}
                >
                  Trocar
                </button>
              </div>
            </form>
          </div>
          <form className="row w-100 p-1 pb-2 align-items-end border-bottom m-0">
            <div className="col-sm-4 mb-1">
              <label className="ms-2">Grupo</label>
              <Typeahead
                id="typeahead-grupos"
                placeholder="Escolha o Grupo"
                labelKey={"nome_grupo"}
                emptyLabel="Nenhum grupo encontrado"
                onChange={onSelectGrupo}
                options={grupos}
              />
            </div>
            <div className="col-sm-4 mb-1">
              <label className="ms-2">Intervalo</label>
              <DatePicker
                className="form-control"
                locale={ptBR}
                dateFormat="dd/MM/yyyy"
                onChange={(dates) => handleDateChange(i, dates)}
                startDate={selectedDateRange.index === i? selectedDateRange.dates[0]:null}
                endDate={selectedDateRange.index === i? selectedDateRange.dates[1]:null}
                selectsRange={selectedDateRange}
                placeholderText="Selecione um intervalo de datas"
              />
            </div>
            <div className="col-sm-4 mt-1 mb-1">
              <button
                className="btn border-primary text-primary"
                onClick={(e) => {
                  e.preventDefault();
                  onAddRemoveGroup(estagio);
                }}
              >
                Adiciona/Remove
              </button>
            </div>
          </form>
          <table className="table table-striped table-hover">
            <thead>
              <tr className="text-center">
                <th scope="col">Rodízio</th>
                <th scope="col">Grupo</th>
                <th scope="col">Data Inicial</th>
                <th scope="col">Data Final</th>
              </tr>
            </thead>
            <tbody>
              {estagio?.grupos?.map((g, index) => (
                <tr className="text-center align-middle" key={g.nome}>
                  <td>{index + 1}</td>
                  <td>{g.nome}</td>
                  <td>{`${g.data_inicio.substring(8)}/
                  ${g.data_inicio.substring(5, 7)}/
                  ${g.data_inicio.substring(0, 4)}`}</td>
                  <td>{`${g.data_final.substring(8)}/
                  ${g.data_final.substring(5, 7)}/
                  ${g.data_final.substring(0, 4)}`}</td>
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
          placeholder="Nome do estágio"
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
