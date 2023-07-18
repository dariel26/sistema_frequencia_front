export default function CardSimples({ children, titulo, tituloCentralizado }) {
  return (
    <div className="card w-100 h-100 rounded-0 border-0">
      <div
        className={`card-header ${
          tituloCentralizado ? "" : "text-start"
        } d-flex align-items-center`}
        style={{ height: "57px" }} //TODO Padronizar
      >
        <h4 className="col mb-0">{titulo}</h4>
      </div>
      <div
        className="card-body overflow-auto position-relative"
        style={{ height: "calc(100% - 57px)" }}
      >
        {children}
        <div className="col-12 w-100" style={{ height: "300px" }} />
      </div>
    </div>
  );
}
