import { useState } from "react";

export default function Add({ keys, uniqueKey, objsTitleValue, users, onAdd, setStartAdd }) {
  const [fileName, setFileName] = useState(undefined);
  const [arrInput, setArrInput] = useState(Array(keys.length).fill(""));
  const [arrUsers, setArrUsers] = useState([]);


  function userExist(user) {
    const indexKey = keys.findIndex((k) => k === uniqueKey);
    if (users.find((u) => u[uniqueKey] === user[indexKey]) === undefined) {
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
    const indexKey = keys.findIndex((k) => k === uniqueKey);
    if (arrUsers.find((u) => u[indexKey] === user[indexKey]) === undefined) {
      return false;
    } else {
      console.log("email repetido")
    }
  }

  function extractKeys(arrResult) {
    let keysResult = arrResult[0]?.split(" ");
    keysResult = keysResult.map((key, index) => {
      if (keys.find((k) => k === key.trim())) {
        return { key: key.trim(), index };
      } else {
        return undefined;
      }
    });
    keysResult = keysResult.filter((k) => k !== undefined);
    if (keysResult.length !== keys.length) {
      return false;
    } else {
      return keysResult;
    }
  }

  function extractDatas(arrResult) {
    const keys = extractKeys(arrResult);
    if (keys === false) {
      return false;
    } else {
      let datas = [];
      for (let i = 0; i < arrResult.length; i++) {
        const sentence = arrResult[i];
        if (i !== 0) {
          const arrValues = sentence.split('" "');
          const keyMaxIndex = keys[keys.length - 1].index;
          if (arrValues.length - keyMaxIndex >= 1) {
            const rows = keys.map((k) => {
              return arrValues[k.index].replace('"', "").trim();
            });
            if (emailWasAdd(rows) === false && userCorrect(rows)) {
              datas.push(rows);
            }
          }
        }
      }
      return datas;
    }
  }

  function readFile(event) {
    const result = event.target.result;
    const arrResult = result.split("\n");
    const datas = extractDatas(arrResult);
    if (datas === false) {
      console.log("documento inválido");
    } else {
      setArrUsers((arr) => {
        const newArr = Object.assign([], arr);
        datas.forEach((d) => {
          newArr.push(d);
        });
        return newArr;
      });
    }
  }

  function onSelectFile(e) {
    const reader = new FileReader();
    reader.addEventListener("load", readFile);
    reader.readAsText(e.target?.files[0]);
    setFileName(e.target?.files[0]?.name);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (emailWasAdd(arrInput) === false && userCorrect(arrInput)) {
      setArrUsers((arr) => {
        const newArr = Object.assign([], arr);
        newArr.push(arrInput);
        return newArr;
      });
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
                  <td key={k}>{u[i]}</td>
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