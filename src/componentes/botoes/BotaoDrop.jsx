import { gerarChaveUnica } from "../../utils";

export default function BotaoDrop({ textoBotao, dadosMenu }) {
  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {textoBotao}
      </button>
      <ul className="dropdown-menu p-0">
        {dadosMenu?.map(({ texto, visible, acao }) => {
          return visible ? (
            <li className="row w-100 h-100 p-0" key={gerarChaveUnica()}>
              <label
                role="button"
                className="col-12 h-100 align-middle ms-1 pt-1 pb-1"
                onClick={acao}
              >
                {texto}
              </label>
            </li>
          ) : undefined;
        })}
      </ul>
    </div>
  );
}
