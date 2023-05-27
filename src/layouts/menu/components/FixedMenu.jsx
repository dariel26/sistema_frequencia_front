import { NavLink } from 'react-router-dom';

export default function FixedMenu(props) {

    return (
        <div className="d-flex flex-column bg-menu-dark-light w-100 h-100">
            <div className="d-flex w-100 bg-menu-dark-dark"
                style={{ height: "100px" }}>
                <img src={process.env.PUBLIC_URL + "/logo512.png"} alt="logo"
                    className="w-100 h-100" style={{ objectFit: "scale-down" }} />
            </div>
            <div className="d-flex flex-column w-100" style={{ overflowY: "auto", overflowX: "hidden" }}>
                <div className="d-flex w-100 ps-2 align-items-center"
                    style={{ height: "30px", flexShrink: 0 }}>
                    <span className="fw-bold text-light">
                        Menu
                    </span>
                </div>
                {
                    props.navs ? props.navs.map((nav, index) => (
                        <NavLink to={nav.path} onClick={props.close}
                            className={({ isActive }) => isActive ? "my-menu d-flex w-100 bg-menu-light text-menu-active" : "my-menu d-flex w-100 text-light"}
                            key={index} style={{ height: "50px", textDecoration: "none", flexShrink: 0 }}>
                            <div className="d-flex h-100 justify-content-center align-items-center" style={{ width: "50px" }}>
                                {nav.icon}
                            </div>
                            <div className="d-flex h-100 align-items-center"
                                style={{ width: "calc(100% - 50px)", transition: "width 300ms" }}>
                                <span>{nav.name}</span>
                            </div>
                        </NavLink>
                    )) : undefined
                }
            </div>
        </div>
    );
}