import { NavLink } from "react-router-dom";
import "./menus.css";

export default function FixedMenu(props) {
  return (
    <div className="d-flex flex-column bg-menu-dark-light w-100 h-100">
      <div className="d-flex w-100 bg-menu-dark-dark align-items-center header">
        <img
          src={process.env.PUBLIC_URL + "/med_i.webp"}
          alt="logo"
          className="w-100 h-75 image"
        />
      </div>
      <div className="d-flex flex-column w-100 corpo">
        <div className="d-flex w-100 ps-2 align-items-center titulo">
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
                    ? "my-menu row p-0 m-0 bg-menu-light text-menu-active align-items-center navs"
                    : "my-menu row p-0 m-0 text-light align-items-center navs"
                }
                key={index}
              >
                <span className="col-3 justify-content-center d-flex">
                  {nav.icon}
                </span>
                <span className="col-9 ps-0">{nav.name}</span>
              </NavLink>
            ))
          : undefined}
      </div>
    </div>
  );
}
