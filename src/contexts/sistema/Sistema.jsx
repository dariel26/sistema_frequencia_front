import { createContext, useState } from "react";
import {
  AlertaToast,
  ModalCarregando,
  ModalConcorda,
  ModalConfirma,
} from "../../componentes";
import uuid from "react-uuid";

export const SistemaContext = createContext({
  concorda: (mensagem) => {},
  carregando: (estado) => {},
  confirma: async (mensagem) => {},
  sucesso: (msg) => {},
  error: (msg) => {},
  aviso: (msg) => {},
  alertas: [{ texto: "", variante: "", id: "", deletar: () => {} }],
});

const ALERTA_TIMEOUT = 4000;

export default function SistemaProvider(props) {
  const [resAviso, setResAviso] = useState();
  const [mensagem, setMensagem] = useState("");
  const [mostrarModalConcorda, setMostrarModalConcorda] = useState(false);
  const [mostrarModalCarregando, setMostrarModalCarregando] = useState(false);
  const [mostrarModalConfirma, setMostrarModalConfirma] = useState(false);
  const [alertas, setAlertas] = useState([]);

  function concorda(mensagem) {
    setMostrarModalConcorda(true);
    setMensagem(mensagem);

    new Promise((resolve) => {
      setResAviso(() => resolve);
    }).then((_) => {
      setMensagem("");
      setMostrarModalConcorda(false);
    });
  }

  async function confirma(mensagem) {
    setMostrarModalConfirma(true);
    setMensagem(mensagem);

    const res = await new Promise((resolve) => {
      setResAviso(() => resolve);
    });
    setMensagem("");
    setMostrarModalConfirma(false);
    return res;
  }

  function carregando(estado) {
    setMostrarModalCarregando(estado);
  }

  function adicionaAlerta(msg, variante) {
    const id = uuid();
    const alerta = {
      id,
      texto: msg,
      variante,
      deletar: () => deletaAlerta(id),
    };
    setAlertas((antigos) => [...antigos, alerta]);

    setTimeout(() => {
      deletaAlerta(id);
    }, ALERTA_TIMEOUT);
  }

  function deletaAlerta(id) {
    setAlertas((antigos) => antigos.filter((a) => a.id !== id));
  }

  return (
    <SistemaContext.Provider
      value={{
        concorda,
        carregando,
        confirma,
        alertas,
        sucesso: (msg) => adicionaAlerta(msg, "success"),
        aviso: (msg) => adicionaAlerta(msg, "warning"),
        error: (msg) => adicionaAlerta(msg, "danger"),
      }}
    >
      <AlertaToast />
      <ModalConcorda
        show={mostrarModalConcorda}
        resAviso={resAviso}
        mensagem={mensagem}
      />
      <ModalConfirma
        show={mostrarModalConfirma}
        resAviso={resAviso}
        mensagem={mensagem}
      />
      <ModalCarregando show={mostrarModalCarregando} />
      {props.children}
    </SistemaContext.Provider>
  );
}
