import { createContext, useState } from "react";
import { GrClose } from "react-icons/gr";
import "./Alert.css";

export const AlertContext = createContext();

export default function Alert(props) {
  const [alerts, setAlerts] = useState([]);
  const [counter, setCounter] = useState(1000);

  const removeLastAlert = () => {
    if (alerts.length > 0) {
      alerts.pop();
      setAlerts([...alerts]);
      setCounter(counter);
    }
  };

  const clearAllAlerts = () => {
    setAlerts([]);
    setCounter(1000);
  };

  const setTime = (time, index) => {
    if (time) {
      setTimeout(() => {
        const alert = document.getElementById(`alert${index}`);
        if (alert) {
          alert.remove();
        }
      }, time);
    }
  };

  const addAlert = ({
    title,
    message,
    linkMessage,
    link,
    time,
    sucess,
    danger,
  }) => {
    const variantAlert = sucess
      ? "alert-success"
      : danger
      ? "alert-danger"
      : "alert-warning";
    const varianText = sucess
      ? "text-success"
      : danger
      ? "text-danger"
      : "text-warning";
    alerts.push({
      index: counter,
      child: (
        <div
          className={`alert ${variantAlert} my-alert position-fixed me-2 mt-2`}
          role="alert"
          key={counter}
          id={"alert" + counter}
          style={{ zIndex: counter }}
        >
          <button
            className="position-absolute btn btn-link end-0 top-0 mt-2 me-2"
            onClick={removeLastAlert}
          >
            <GrClose />
          </button>
          <h4 className="alert-heading">{title}</h4>
          <p>
            {message}{" "}
            <a className={varianText} href={link}>
              {linkMessage}
            </a>
          </p>
        </div>
      ),
    });
    setAlerts([...alerts]);
    setTime(time, counter);
    setCounter(counter + 1);
  };

  return (
    <AlertContext.Provider value={{ addAlert, clearAllAlerts }}>
      {alerts.map((alert) => alert.child)}
      {props.children}
    </AlertContext.Provider>
  );
}
