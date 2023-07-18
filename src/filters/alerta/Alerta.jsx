import { useCallback, useEffect } from "react";
import { createContext, useState } from "react";
import { GrClose } from "react-icons/gr";
import "./Alerta.css";

export const AlertaContext = createContext();

export default function FiltroAlerta(props) {
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

  const adicionaAlerta = (error, mess) => {
    let varianteTexto = "";
    let varianteAlerta = "";
    let mensagem = "";
    let estado = "";
    if (error?.response?.status === 401) {
      varianteTexto = "text-warning";
      varianteAlerta = "alert-warning";
      mensagem = error.response?.data.message;
      estado = error.response?.status;
    } else if (error?.response?.status === 403) {
      varianteTexto = "text-warning";
      varianteAlerta = "alert-warning";
      mensagem = error.response?.data.message;
      estado = error.response?.status;
    } else if (error?.response?.status === 500) {
      varianteTexto = "text-danger";
      varianteAlerta = "alert-danger";
      mensagem = error.response?.data.message;
      estado = error.response?.status;
    } else if (error) {
      varianteTexto = "text-warning";
      varianteAlerta = "alert-warning";
      mensagem = error.message;
      estado = "";
    } else {
      varianteTexto = "text-success";
      varianteAlerta = "alert-success";
      mensagem = mess;
      estado = "";
    }
    setStackAlerts((stack) => {
      stack.push({ status: estado, message: mensagem, varianText: varianteTexto, variantAlert: varianteAlerta });
      return Object.assign([], stack);
    });
  };

  return (
    <>
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
      <AlertaContext.Provider value={{ addAlert: adicionaAlerta, adicionaAlerta }}>
        {props.children}
      </AlertaContext.Provider>
    </>
  );
}
