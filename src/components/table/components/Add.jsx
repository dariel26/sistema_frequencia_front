import { useContext } from "react";
import { useState } from "react";
import { read, utils } from "xlsx";
import { AlertContext } from "../../../filters/alert/Alert";

export default function Add({
  keys,
  uniqueKey,
  objsTitleValue,
  users,
  onAdd,
  setStartAdd,
}) {
  const [fileName, setFileName] = useState(undefined);
  const [arrInput, setArrInput] = useState(Array(keys.length).fill(""));
  const [arrUsers, setArrUsers] = useState([]);

  const alert = useContext(AlertContext);

  function userExist(user) {
    if (users.find((u) => String(u[uniqueKey]) === String(user[uniqueKey])) === undefined) {
      return false;
    } else {
      return true;
    }
  }

  function userCorrect(user) {
    if (user.findIndex((u) => u === "" || u === undefined) === -1) {
      return true;
    } else {
      return false;
    }
  }

  function emailWasAdd(user) {
    if (arrUsers.find((u) => u[uniqueKey] === user[uniqueKey]) === undefined) {
      return false;
    } else {
      alert.addAlert(new Error("Email ou Matricula repetida"));
    }
  }

  function readFile(e) {
    const data = new Uint8Array(e.target.result);
    const workbook = read(data, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = utils.sheet_to_json(worksheet);
    const users = [];
    for (const user of jsonData) {
      const u = new Map();
      for (let i = 0; i < keys.length; i++) {
        u[keys[i]] = user[keys[i]];
        if (
          user[keys[i]] === undefined ||
          user[keys[i]] === null ||
          user[keys[i]] === ""
        ) {
          alert.addAlert(new Error("Arquivo mal formatado"));
          return;
        }
      }
      users.push(u);
    }
    setArrUsers(users);
  }

  function onSelectFile(e) {
    const reader = new FileReader();
    reader.addEventListener("load", readFile);
    reader.readAsArrayBuffer(e.target?.files[0]);
    setFileName(e.target?.files[0]?.name);
  }

  function onSubmit(e) {
    e.preventDefault();
    const user = new Map();
    for (let i = 0; i < keys.length; i++) {
      user[keys[i]] = arrInput[i];
    }
    if (emailWasAdd(user) === false && userCorrect(arrInput)) {
      arrUsers.push(user);
      setArrUsers(Object.assign([], arrUsers));
      setArrInput(Array(keys.length).fill(""));
    }
  }

  function onTyping(e, i) {
    setArrInput((arr) => {
      const newArr = Object.assign([], arr);
      newArr[i] = e.target.value;
      return newArr;
    });
  }

  return (
    <div className="row">
      <div className="input-group mb-3 col-sm-2">
        <input
          type="file"
          accept=".xlsx"
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
      <div className="d-flex justify-content-end">
        <form className="row g-3" noValidate>
          {keys.map((k, i) => (
            <div className="col-md-6" key={k}>
              <label htmlFor="inputadd" className="form-label">
                {objsTitleValue.find((obj) => obj.value === k).title}
              </label>
              <input
                type="text"
                className="form-control"
                id="inputadd"
                value={arrInput[i]}
                onChange={(e) => onTyping(e, i)}
                required
              />
            </div>
          ))}
          <div className="col-12 text-end">
            <button
              className="btn btn-primary"
              type="submit"
              onClick={onSubmit}
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
      <div className="col-12">
        <table className="table table-striped table-hover">
          <thead>
            <tr className="text-center">
              <th scope="col">#</th>
              {keys?.map((k) => (
                <th scope="col" key={k}>
                  {objsTitleValue.find((obj) => obj.value === k)?.title}
                </th>
              ))}
              <th scope="col">Cadastrado</th>
            </tr>
          </thead>
          <tbody>
            {arrUsers?.map((u, index) => (
              <tr className="text-center align-middle" key={index}>
                <td>{index + 1}</td>
                {keys?.map((k, i) => (
                  <td key={k}>{u[k]}</td>
                ))}
                <td>{userExist(u) ? "Sim" : "Não"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="col-12 text-center">
        <button
          className="btn btn-secondary"
          onClick={(_) => {
            if (onAdd) onAdd(arrUsers);
            setStartAdd(false);
            setArrUsers([]);
          }}
        >
          Cadastrar
        </button>
      </div>
    </div>
  );
}
