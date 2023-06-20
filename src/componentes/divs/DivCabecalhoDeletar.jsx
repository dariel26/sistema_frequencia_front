export default function DivCabecalhoDeletar({
  titulo,
  aoDeletar,
  textoBotao,
  children,
}) {
  return (
    <div className="mb-5 border-bottom border-4 border-primary">
      <div className="d-flex align-items-center justify-content-between">
        <span className="fs-5 fw-bold">{titulo}</span>
        <label role="button" className="text-primary" onClick={aoDeletar}>
          {textoBotao}
        </label>
      </div>
      {children}
    </div>
  );
}
