export default function CardDefault({ children, title }) {
  return (
    <div className="card w-100 rounded-0 border-0">
      <div className="card-header">
        <h5 className="col-sm-5">{title}</h5>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}
