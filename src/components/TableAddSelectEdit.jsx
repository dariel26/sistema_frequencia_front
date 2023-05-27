import { useState } from "react";
import { AiFillEdit } from "react-icons/ai";

export default function TableAddSelectEdit({
  objsTitleValue,
  datas,
  onDelete,
  onAdd,
  onEdit,
}) {
  const [startDelete, setStartDelete] = useState(false);
  const [startAdd, setStartAdd] = useState(false);
  const [datasToDelete, setDatasToDelete] = useState([]);

  function onSelect(d) {
    if (datasToDelete.find((datas) => datas === d)) {
      setDatasToDelete((datas) => {
        let newDatas = Object.assign([], datas);
        newDatas = newDatas.filter((data) => data !== d);
        return newDatas;
      });
    } else {
      setDatasToDelete((datas) => {
        const newDatas = Object.assign([], datas);
        newDatas.push(d);
        return newDatas;
      });
    }
  }

  function onClickSelect(e) {
    e.preventDefault();
    if (startDelete) {
      if (onDelete) onDelete(datasToDelete);
      setStartDelete(false);
      setDatasToDelete([]);
    } else {
      setStartDelete(true);
    }
  }

  function onClickAdd(e) {
    e.preventDefault();
    if (startAdd) {
      setStartAdd(false);
    } else {
      setStartAdd(true);
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-start">
        <label
          role="button"
          className="text-primary pe-2 pt-2 pb-2"
          onClick={onClickAdd}
        >
          {startAdd ? "Cancelar" : "Adicionar"}
        </label>
        <label
          role="button"
          className="text-primary ps-2 pt-2 pb-2"
          onClick={onClickSelect}
          style={{ display: startAdd ? "none" : "" }}
        >
          {!startDelete
            ? "Selecionar"
            : datasToDelete.length > 0
            ? "Deletar"
            : "Cancelar"}
        </label>
      </div>
      {!startAdd ? (
        <Table
          objsTitleValue={objsTitleValue}
          datas={datas}
          startDelete={startDelete}
          datasToDelete={datasToDelete}
          onSelect={onSelect}
        />
      ) : (
        <Add />
      )}
    </div>
  );
}

function Table({
  objsTitleValue,
  datas,
  startDelete,
  datasToDelete,
  onSelect,
}) {
  const display = startDelete ? "" : "none";
  return (
    <table className="table table-striped table-hover">
      <thead>
        <tr className="text-center">
          <th scope="col">Editar</th>
          {objsTitleValue?.map((obj) => (
            <th scope="col" key={obj.title}>
              {obj.title}
            </th>
          ))}
          <th scope="col" style={{ display }}>
            Apagar
          </th>
        </tr>
      </thead>
      <tbody>
        {datas?.map((d, index) => (
          <tr className="text-center align-middle" key={index}>
            <td>
              <button className="btn">
                <AiFillEdit />
              </button>
            </td>
            {objsTitleValue?.map((obj) => (
              <td key={obj.value}>{d[obj.value]}</td>
            ))}
            <td style={{ display }}>
              <input
                className="form-check-input cursor-pointer"
                role="button"
                type="checkbox"
                checked={
                  datasToDelete.find((data) => data === d) ? true : false
                }
                onChange={(_) => onSelect(d)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Add() {
  const [fileName, setFileName] = useState(undefined);

  function readFile(event) {
    console.log(event.target.result);
  }

  function onSelectFile(e) {
    const reader = new FileReader();
    reader.addEventListener('load', readFile)
    reader.readAsText(e.target?.files[0]);
    setFileName(e.target?.files[0]?.name);
  }
  return (
    <div>
      <div className="input-group mb-3">
        <input
          type="file"
          accept=".txt, .csv"
          className="form-control"
          id="inputGroupFile02"
          style={{ display: "none" }}
          onChange={onSelectFile}
        />
        <label
          role="button"
          className="btn btn-primary text-nowrap"
          htmlFor="inputGroupFile02"
        >
          Procurar Arquivo
        </label>
        <label className="input-group-text" htmlFor="inputGroupFile02">
          {fileName === undefined ? "Nenhum selecionado" : fileName}
        </label>
      </div>
    </div>
  );
}
