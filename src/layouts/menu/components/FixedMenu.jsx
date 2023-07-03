import { NavLink } from "react-router-dom";

export default function FixedMenu(props) {
  return (
    <div className="d-flex flex-column bg-menu-dark-light w-100 h-100">
      <div
        className="d-flex w-100 bg-menu-dark-dark align-items-center"
        style={{ height: "100px" }}
      >
        <img
          src={process.env.PUBLIC_URL + "/med_i.webp"}
          alt="logo"
          className="w-100 h-75"
          style={{ objectFit: "scale-down" }}
        />
      </div>
      <div
        className="d-flex flex-column w-100"
        style={{ overflowY: "auto", overflowX: "hidden" }}
      >
        <div
          className="d-flex w-100 ps-2 align-items-center"
          style={{ height: "30px", flexShrink: 0 }}
        >
          <span className="fw-bold text-light">Menu</span>
        </div>
        {props.navs
          ? props.navs.map((nav, index) => (
              <NavLink
                end
                to={nav.path}
                onClick={props.close}
                className={({ isActive }) =>
                  isActive
                    ? "my-menu row p-0 m-0 bg-menu-light text-menu-active align-items-center"
                    : "my-menu row p-0 m-0 text-light align-items-center"
                }
                key={index}
                style={{
                  height: "50px",
                  textDecoration: "none",
                  flexShrink: 0,
                }}
              >
                <span className="col-3 justify-content-center d-flex">{nav.icon}</span>
                <span className="col-9 ps-0">{nav.name}</span>
              </NavLink>
            ))
          : undefined}
      </div>
    </div>
  );
}
