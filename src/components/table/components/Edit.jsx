import { useEffect, useState } from "react";

export default function Edit({
  user,
  keys,
  objsTitleValue,
  uniqueKey,
  dropdownKey,
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

  function onTyping(e, i) {
    setArrInput((arr) => {
      const newArr = Object.assign([], arr);
      newArr[i] = e.target.value;
      return newArr;
    });
  }

  function onChange(e){
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
          ) : (
            <input
              type="email"
              className="form-control"
              id={"input" + i}
              disabled={k === uniqueKey}
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
            if (onEdit){
                onEdit(arrInput, dropdownOption);
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
