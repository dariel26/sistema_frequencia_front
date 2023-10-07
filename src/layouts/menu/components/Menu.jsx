import { NavLink } from "react-router-dom";
import "./menus.css";

export default function Menu(props) {
  return (
    <div className="d-flex flex-column bg-menu-dark-light w-100 h-100">
      <div
        className={`d-flex w-100 bg-menu-dark-dark align-items-center ${
          props.isClosed ? "header-pequeno" : "header-grande"
        }`}
      >
        <img
          src={process.env.PUBLIC_URL + "/med_i.webp"}
          alt="logo"
          className="w-100 h-75 image"
        />
      </div>
      <div className={`d-flex flex-column w-100 corpo-variavel`}>
        <div
          className={`d-flex w-100 ps-2 align-items-center ${
            props.isClosed ? "titulo-fechado" : "titulo-aberto"
          }`}
        >
          <span
            className={`fw-bold text-light ${props.isClosed ? "d-none" : ""}`}
          >
            Menu
          </span>
        </div>
        {props.navs
          ? props.navs.map((nav, index) => (
              <NavLink
                to={nav.path}
                id="my-left-nav"
                className={({ isActive }) =>
                  isActive
                    ? "my-menu d-flex w-100 bg-menu-light text-menu-active navs"
                    : "my-menu d-flex w-100 text-light navs"
                }
                key={index}
              >
                <div className="d-flex h-100 justify-content-center align-items-center navs-icon">
                  {nav.icon}
                </div>
                <div
                  className={`d-flex h-100 align-items-center ${
                    props.isClosed ? "navs-fechada" : "navs-aberta"
                  }`}
                >
                  <span
                    className={`text-nowrap ${props.isClosed ? "d-none" : ""}`}
                  >
                    {nav.name}
                  </span>
                </div>
              </NavLink>
            ))
          : undefined}
      </div>
      <div
        className="d-flex w-100 bg-menu-dark-dark footer"
        id="my-menu-footer"
      >
        {props.actions
          ? props.actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="btn d-flex p-0 w-100 navs rounded-0 border-0"
                id="my-left-button"
              >
                <div className="d-flex h-100 justify-content-center align-items-center text-light navs-icon">
                  {action.icon}
                </div>
                <div
                  className={`d-flex h-100 align-items-center ${
                    props.isClosed ? "navs-fechada" : "navs-aberta"
                  }`}
                >
                  <span
                    className={`text-light text-nowrap ${
                      props.isClosed ? "d-none" : ""
                    }`}
                  >
                    {action.name}
                  </span>
                </div>
              </button>
            ))
          : undefined}
      </div>
    </div>
  );
}
