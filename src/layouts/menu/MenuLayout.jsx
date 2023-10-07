import { createRef, useCallback, useEffect, useState } from "react";
import { FaAngleDoubleLeft } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMenu } from "react-icons/io5";
import { Outlet } from "react-router-dom";
import FixedMenu from "./components/FixedMenu";
import Menu from "./components/Menu";
import "./MenuLayout.css";
import { Dropdown } from "react-bootstrap";
import React from "react";

export default function MenuLayout(props) {
  const [isClosed, setIsClosed] = useState(false);
  const [isClosedFixed, setIsClosedFixed] = useState(true);
  const [startMouse, setStartMouse] = useState(undefined);
  const wrapperRef = createRef();

  const handleClickOutside = useCallback(
    (event) => {
      if (
        wrapperRef &&
        !wrapperRef.current.contains(event.target) &&
        isClosedFixed === false
      ) {
        setIsClosedFixed(true);
      }
    },
    [wrapperRef, isClosedFixed]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleCloseLeftMenu = () => {
    const left = document.getElementById("my-left");
    if (isClosed) {
      left.style.width = "200px";
    } else {
      left.style.width = "50px";
    }
    setIsClosed(!isClosed);
  };

  const handleOpenFixedMenu = () => {
    setIsClosedFixed(false);
  };

  const onMouseDown = (e) => {
    setStartMouse(e.clientX ?? e.targetTouches[0].clientX);
  };

  const onMouseUp = (e) => {
    setStartMouse(undefined);
    const menu = document.getElementById("my-fixed-left");
    if ((e.clientX ?? e.changedTouches[0].clientX) > 100) {
      menu.style.transform = `translate(0px, 0px)`;
      menu.style.transition = "transform 100ms";
    } else {
      setIsClosedFixed(true);
      menu.style.transition = "transform 100ms";
    }
  };

  const onMouseMove = (e) => {
    if (startMouse === undefined) return;
    else {
      const menu = document.getElementById("my-fixed-left");
      const dif = startMouse - (e.clientX ?? e.targetTouches[0].clientX);
      if (dif > 0) {
        menu.style.transition = "none";
        menu.style.transform = `translate(-${dif}px, 0px)`;
      }
    }
  };

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <button
      className="btn pe-1 border-0"
      type="button"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </button>
  ));

  return (
    <div className="d-flex bg-light dimensoes-externas">
      <div
        className="d-flex flex-column bg-menu-primary h-100 dimensoes-lateral"
        id="my-left"
      >
        <div className="d-flex w-100 dimensoes-altura">
          <Menu actions={props.actions} isClosed={isClosed} navs={props.navs} />
        </div>
        <button
          className="btn btn-menu-dark-dark d-flex w-100 p-0 botao-inferior rounded-0"
          onClick={handleCloseLeftMenu}
        >
          <div
            className={`btn p-0 d-flex h-100 justify-content-center align-items-center ${
              isClosed ? "botao-fechado" : "botao-aberto"
            }`}
            id="my-left-close"
          >
            <span
              className={`text-light fw-bold text-nowrap ${
                isClosed ? "d-none" : ""
              }`}
            >
              Fechar Menu
            </span>
          </div>
          <div
            className={`d-flex h-100 text-light justify-content-center align-items-center ${
              isClosed ? "icone-botao-fechado" : "icone-botao-aberto"
            }`}
            id="my-left-icon"
          >
            <FaAngleDoubleLeft size={20} />
          </div>
        </button>
      </div>
      <div
        className={`position-fixed h-100 bg-menu-dark row m-0 ${
          isClosedFixed ? "barra-fixa-fechada" : "barra-fixa-aberta"
        }`}
        ref={wrapperRef}
        id="my-fixed-left"
      >
        <div className="col-12 p-0">
          <FixedMenu
            navs={props.navs}
            close={() => {
              setIsClosedFixed(true);
            }}
          />
        </div>
        <div
          className="col-12 h-100 w-100 p-0 bg-menu-dark-light"
          onMouseUp={onMouseUp}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onTouchStart={onMouseDown}
          onTouchEnd={onMouseUp}
          onTouchMove={onMouseMove}
        />
      </div>
      <div
        className={`h-100 w-100 position-absolute ${
          isClosedFixed ? "sombra-invisivel" : "sombra-visivel"
        }`}
      />
      <div
        className={`d-flex flex-column h-100 ${
          isClosed ? "corpo-fechado" : "corpo-aberto"
        }`}
        id="my-right"
      >
        <div
          className={`d-flex bg-menu-primary w-100 border-bottom ${
            isClosedFixed ? "header-fechado" : "header-aberto"
          }`}
          id="my-top"
        >
          <button
            className="btn p-0 h-100 text-dark justify-content-center align-items-center border-0 d-none top-close"
            id="my-top-close"
            onClick={handleOpenFixedMenu}
          >
            <IoMenu size={29} className="text-light" />
          </button>
          <div
            className="justify-content-end h-100 align-items-center pe-2 top-button d-none"
            id="my-top-button"
          >
            {props.actions ? (
              <Dropdown>
                <Dropdown.Toggle as={CustomToggle}>
                  <BsThreeDotsVertical size={20} className="text-light" />
                </Dropdown.Toggle>
                <Dropdown.Menu className="bg-menu-dark-dark">
                  {props.actions.map((action, index) => (
                    <Dropdown.Item
                      as="button"
                      key={index}
                      onClick={action.onClick}
                      className="d-flex align-items-center bg-menu-dark-dark text-light"
                    >
                      <div className="d-flex h-100 link-nome">
                        {action.name}
                      </div>
                      <div className="d-flex justify-content-center align-items-center h-100 link-icon">
                        {action.icon}
                      </div>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            ) : undefined}
          </div>
        </div>
        <div
          className={`d-flex w-100 h-100 bg-light ${
            isClosedFixed ? "" : "bottom"
          }`}
          id="my-bottom"
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
