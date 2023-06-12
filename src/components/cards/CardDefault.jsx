export default function CardDefault({ children, title }) {
  return (
    <div className="card w-100 h-100 rounded-0 border-0">
      <div className="card-header" style={{height: "45px"}}>
        <h5 className="col-sm-5">{title}</h5>
      </div>
      <div className="card-body overflow-auto position-relative" style={{height: "calc(100% - 45px)"}}>{children}</div>
    </div>
  );
}
