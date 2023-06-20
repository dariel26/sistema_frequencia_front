import { useEffect, useState } from "react";

export default function Edit({
  user,
  keys,
  idKey,
  objsTitleValue,
  uniqueKey,
  dropdownKey,
  checkboxKey,
  dropdownOptions,
  onEdit,
  setIndexEdit,
}) {
  const [arrInput, setArrInput] = useState(Array(keys.length).fill(""));
  const [dropdownOption, setDropdownOption] = useState("");

  useEffect(() => {
    const newArrInput = [];
    keys?.forEach((k) => {
      newArrInput.push(user[k]);
    });
    setDropdownOption(user[dropdownKey]);
    setArrInput(newArrInput);
  }, [keys, dropdownKey, user]);

  function onTyping(e, i, checked) {
    setArrInput((arr) => {
      const newArr = Object.assign([], arr);
      if (checked) {
        newArr[i] = e.target.checked;
      }
      else newArr[i] = e.target.value;
      return newArr;
    });
  }

  function onChange(e) {
    setDropdownOption(e.target.value);
  }

  return (
    <form className="row g-3">
      {keys?.map((k, i) => (
        <div className="col-md-4" key={i}>
          <label htmlFor={"input" + i} className="form-label">
            {objsTitleValue?.find((obj) => obj.value === k)?.title}
          </label>
          {k === dropdownKey ? (
            <select
              className="form-select"
              aria-label="Default select example"
              value={dropdownOption}
              onChange={onChange}
            >
              {dropdownOptions?.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ) : k === checkboxKey ? (
            <div className="mt-2">
              <input
                type="checkbox"
                className="btn-check"
                id="btn-check-outlined"
                autoComplete="off"
                onChange={(e) => onTyping(e, i, true)}
              />
              <label
                className="btn btn-outline-primary"
                htmlFor="btn-check-outlined"
              >
                Restaurar {checkboxKey} padrão
              </label>
            </div>
          ) : (
            <input
              type="email"
              className="form-control"
              id={"input" + i}
              value={arrInput[i]}
              onChange={(e) => onTyping(e, i)}
            />
          )}
        </div>
      ))}
      <div className="col-12 text-center">
        <button
          type="submit"
          className="btn btn-primary"
          onClick={(e) => {
            e.preventDefault();
            if (onEdit) {
              onEdit(arrInput, dropdownOption, user[idKey]);
              setIndexEdit(-1);
            }
          }}
        >
          Editar
        </button>
      </div>
    </form>
  );
}
