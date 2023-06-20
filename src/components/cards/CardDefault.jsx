export default function CardDefault({ children, title, titleCenter }) {
  return (
    <div className="card w-100 h-100 rounded-0 border-0">
      <div
        className={`card-header ${titleCenter ? "" : "text-start"}`}
        style={{ height: "45px" }}
      >
        <h5 className="col">{title}</h5>
      </div>
      <div
        className="card-body overflow-auto position-relative"
        style={{ height: "calc(100% - 45px)" }}
      >
        {children}
      </div>
    </div>
  );
}
