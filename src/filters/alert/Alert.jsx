import { useCallback, useEffect } from "react";
import { createContext, useState } from "react";
import { GrClose } from "react-icons/gr";
import "./Alert.css";

export const AlertContext = createContext();

export default function Alert(props) {
  const [alert, setAlert] = useState({});
  const [stackAlerts, setStackAlerts] = useState([]);
  const [blWait, setBlWait] = useState(false);
  const [timeOutReference, setTimeOutReference] = useState("");

  const showAlert = useCallback(() => {
    if (blWait) return;
    if (stackAlerts.length === 0) return;
    const firstOnStack = stackAlerts[0];
    setAlert(firstOnStack);
    setBlWait(true);
    setTime();
    setStackAlerts((stack) => {
      stack.shift();
      return stack;
    });
  }, [stackAlerts, blWait]);

  useEffect(() => {}, []);

  useEffect(() => {
    showAlert();
  }, [blWait, showAlert, stackAlerts]);

  const onCloseAlert = (e) => {
    setAlert({});
    setBlWait(false);
    clearTimeout(timeOutReference);
  };

  const setTime = () => {
    const time = setTimeout(() => {
      setAlert({});
      setBlWait(false);
    }, 5000);
    setTimeOutReference(time);
  };

  const addAlert = useCallback((error, mess) => {
    let varianText = "";
    let variantAlert = "";
    let message = "";
    let status = "";
    if (error?.response?.status === 401) {
      varianText = "text-warning";
      variantAlert = "alert-warning";
      message = error.response?.data.message;
      status = error.response?.status;
    } else if (error?.response?.status === 403) {
      varianText = "text-warning";
      variantAlert = "alert-warning";
      message = error.response?.data.message;
      status = error.response?.status;
    } else if (error?.response?.status === 500) {
      varianText = "text-danger";
      variantAlert = "alert-danger";
      message = error.response?.data.message;
      status = error.response?.status;
    } else if (error) {
      varianText = "text-warning";
      variantAlert = "alert-warning";
      message = error.message;
      status = "";
    } else {
      varianText = "text-success";
      variantAlert = "alert-success";
      message = mess;
      status = "";
    }
    setStackAlerts((stack) => {
      stack.push({ status, message, varianText, variantAlert });
      return Object.assign([], stack);
    });
  }, []);

  return (
    <AlertContext.Provider value={{ addAlert }}>
      {alert.status !== undefined ? (
        <div
          className={`alert ${alert.variantAlert} my-alert position-fixed me-2 mt-2`}
          role="alert"
          style={{ zIndex: 1000 }}
        >
          <button
            className="position-absolute btn btn-link end-0 top-0 mt-2 me-2"
            onClick={onCloseAlert}
          >
            <GrClose />
          </button>
          <h4 className="alert-heading">{alert.status}</h4>
          <p>{alert.message}</p>
        </div>
      ) : undefined}
      {props.children}
    </AlertContext.Provider>
  );
}
