import { AiFillEdit } from "react-icons/ai";

export default function Table({
  objsTitleValue,
  datas,
  startDelete,
  datasToDelete,
  onSelect,
  setIndexEdit,
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
            Deletar
          </th>
        </tr>
      </thead>
      <tbody>
        {datas?.map((d, index) => (
          <tr className="text-center align-middle" key={index}>
            <td>
              <button className="btn" onClick={(e) => setIndexEdit(index)}>
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
