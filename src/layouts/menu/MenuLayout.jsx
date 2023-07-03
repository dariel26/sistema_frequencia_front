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
    const right = document.getElementById("my-right");
    const left = document.getElementById("my-left");
    if (isClosed) {
      left.style.width = "200px";
      right.style.width = "calc(100% - 200px)";
    } else {
      left.style.width = "50px";
      right.style.width = "calc(100% - 50px)";
    }
    setIsClosed(!isClosed);
  };

  const handleOpenFixedMenu = () => {
    setIsClosedFixed(false);
  };

  const onMouseDown = (e) => {
    console.log("menuClicado");
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
      className="btn pe-1"
      type="button"
      ref={ref}
      style={{ border: "none" }}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </button>
  ));

  return (
    <div
      className="d-flex bg-light"
      style={{ height: "100vh", width: "100vw" }}
    >
      <div
        className="d-flex flex-column bg-menu-primary h-100"
        id="my-left"
        style={{ width: "200px", flexShrink: 0, transition: "width 300ms" }}
      >
        <div className="d-flex w-100" style={{ height: "calc(100% - 50px)" }}>
          <Menu actions={props.actions} isClosed={isClosed} navs={props.navs} />
        </div>
        <button
          className="btn btn-menu-dark-dark d-flex w-100 p-0"
          style={{ height: "50px", borderRadius: "0px", border: "none" }}
          onClick={handleCloseLeftMenu}
        >
          <div
            className="btn p-0 d-flex h-100 justify-content-center align-items-center"
            id="my-left-close"
            style={
              isClosed
                ? { width: "0px", border: "none", transition: "width 300ms" }
                : {
                    width: "calc(100% - 50px)",
                    border: "none",
                    transition: "width 300ms",
                  }
            }
          >
            <span
              style={isClosed ? { display: "none" } : {}}
              className="text-light fw-bold text-nowrap"
            >
              Fechar Menu
            </span>
          </div>
          <div
            className="d-flex h-100 text-light justify-content-center align-items-center"
            id="my-left-icon"
            style={
              isClosed
                ? {
                    width: "50px",
                    transition: "transform 300ms",
                    transform: "rotateY(180deg)",
                  }
                : { width: "50px", transition: "transform 300ms" }
            }
          >
            <FaAngleDoubleLeft size={20} />
          </div>
        </button>
      </div>
      <div
        className="position-fixed h-100 bg-menu-dark row m-0"
        ref={wrapperRef}
        id="my-fixed-left"
        style={
          isClosedFixed
            ? {
                display: "none",
                width: "200px",
                transform: "translate(-200px, 0px)",
                transition: "transform 100ms",
                zIndex: 1090,
              }
            : {
                display: "none",
                width: "200px",
                transform: "translate(0px, 0px)",
                transition: "transform 100ms",
                zIndex: 1090,
                boxShadow: "2px 0px 20px var(--bs-menu-dark-dark)",
              }
        }
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
        className="h-100 w-100 position-absolute"
        style={
          isClosedFixed
            ? { display: "none" }
            : { display: "flex", zIndex: "50" }
        }
      />
      <div
        className="d-flex flex-column h-100"
        id="my-right"
        style={{ width: "calc(100% - 200px)", transition: "width 300ms" }}
      >
        <div
          className="d-flex bg-menu-primary w-100 border-bottom"
          id="my-top"
          style={
            isClosedFixed
              ? { height: "0px", transition: "height 300ms" }
              : {
                  height: "0px",
                  transition: "height 300ms",
                  filter: "brightness(50%)",
                }
          }
        >
          <button
            className="btn p-0 h-100 text-dark justify-content-center align-items-center"
            id="my-top-close"
            style={{ display: "none", width: "50px", border: "none" }}
            onClick={handleOpenFixedMenu}
          >
            <IoMenu size={29} className="text-light" />
          </button>
          <div
            className="justify-content-end h-100 align-items-center pe-2"
            id="my-top-button"
            style={{ display: "none", width: "calc(100% - 50px)" }}
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
                      <div
                        className="d-flex h-100"
                        style={{ width: "calc(100% - 40px)" }}
                      >
                        {action.name}
                      </div>
                      <div
                        className="d-flex justify-content-center align-items-center h-100"
                        style={{ width: "40px" }}
                      >
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
          className="d-flex w-100 h-100 bg-light"
          id="my-bottom"
          style={isClosedFixed ? {} : { filter: "brightness(50%)" }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
