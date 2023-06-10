import { useState } from "react";
import Add from "./components/Add";
import Edit from "./components/Edit";
import Table from "./components/Table";

export default function TableAddSelectEdit({
  objsTitleValue,
  datas,
  onDelete,
  onAdd,
  onEdit,
  addKeys,
  editKeys,
  uniqueKey,
  dropdownKey,
  dropdownOptions,
}) {
  const [startDelete, setStartDelete] = useState(false);
  const [startAdd, setStartAdd] = useState(false);
  const [indexEdit, setIndexEdit] = useState(-1);
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

  function onClickEdit(e, index) {
    e.preventDefault();
    if (indexEdit !== -1) {
      setIndexEdit(-1);
    } else {
      setIndexEdit(index);
    }
  }

  return (
    <div className="w-100">
      <div className="d-flex justify-content-start">
        <label
          role="button"
          className="text-primary pe-2 pt-2 pb-2"
          onClick={onClickEdit}
          style={{ display: indexEdit === -1 ? "none" : "" }}
        >
          {indexEdit !== -1 ? "Cancelar" : ""}
        </label>
        <label
          role="button"
          className="text-primary pe-2 pt-2 pb-2"
          onClick={onClickAdd}
          style={{ display: indexEdit !== -1 ? "none" : "" }}
        >
          {startAdd ? "Cancelar" : "Adicionar"}
        </label>
        <label
          role="button"
          className="text-primary ps-2 pt-2 pb-2"
          onClick={onClickSelect}
          style={{ display: startAdd || indexEdit !== -1 ? "none" : "" }}
        >
          {!startDelete
            ? "Selecionar"
            : datasToDelete.length > 0
            ? "Deletar"
            : "Cancelar"}
        </label>
      </div>
      {!startAdd && indexEdit === -1 ? (
        <Table
          objsTitleValue={objsTitleValue}
          datas={datas}
          startDelete={startDelete}
          setIndexEdit={setIndexEdit}
          datasToDelete={datasToDelete}
          onSelect={onSelect}
        />
      ) : startAdd ? (
        <Add
          keys={addKeys}
          objsTitleValue={objsTitleValue}
          users={datas}
          uniqueKey={uniqueKey}
          onAdd={onAdd}
          setStartAdd={setStartAdd}
        />
      ) : (
        <Edit
          keys={editKeys}
          user={datas[indexEdit]}
          uniqueKey={uniqueKey}
          objsTitleValue={objsTitleValue}
          dropdownKey={dropdownKey}
          dropdownOptions={dropdownOptions}
          onEdit={onEdit}
          setIndexEdit={setIndexEdit}
        />
      )}
    </div>
  );
}
