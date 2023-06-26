import { gerarChaveUnica } from "../../utils";

export default function TabelaPadrao({
  camposCabecalho,
  dados,
  camposDados,
  numerado,
  aoClicar,
}) {
  const label = (dado, check_visivel) => (
    <label
      role="button"
      className="w-100 h-100 position-absolute start-0 top-0 m-1"
      onClick={() => {
        if (aoClicar === undefined) return;
        if (check_visivel === false) return;
        aoClicar(dado);
      }}
    />
  );

  return (
    <table className="table table-striped table-hover table-sm">
      <thead>
        <tr className="text-center">
          {camposCabecalho?.map(({ texto, visivel }) => {
            return visivel ? (
              <th key={gerarChaveUnica()} scope="col">
                {texto}
              </th>
            ) : undefined;
          })}
        </tr>
      </thead>
      <tbody>
        {dados?.map((dado, index) => (
          <tr
            className="text-center align-middle"
            key={gerarChaveUnica()}
          >
            {numerado ? <td>{index + 1}</td> : undefined}
            {camposDados?.map(
              ({
                texto,
                data,
                funcaoComponente,
                check,
                selecionado,
                visivel,
              }) => {
                return visivel ? (
                  texto ? (
                    <td key={gerarChaveUnica()}>{dado[texto]}</td>
                  ) : data ? (
                    <td key={gerarChaveUnica()}>
                      {`${dado[data].substring(8)}/
                    ${dado[data].substring(5, 7)}/
                    ${dado[data].substring(0, 4)}`}
                    </td>
                  ) : check ? (
                    <td key={gerarChaveUnica()} className="position-relative">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={selecionado(dado)}
                        readOnly
                      />
                      {label(dado, visivel && check)}
                    </td>
                  ) : (
                    <td key={gerarChaveUnica()}>{funcaoComponente(dado)}</td>
                  )
                ) : undefined;
              }
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
