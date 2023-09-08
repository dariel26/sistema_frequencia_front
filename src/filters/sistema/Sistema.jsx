import { createContext, useState } from "react";
import { ModalCarregando, ModalConcorda } from "../../componentes";

export const SistemaContext = createContext({
  concorda: (mensagem) => {},
  carregando: (estado) => {},
});

export default function FiltroSistema(props) {
  const [resAviso, setResAviso] = useState();
  const [mensagem, setMensagem] = useState("");
  const [mostrarModalConcorda, setMostrarModalConcorda] = useState(false);
  const [mostrarModalCarregando, setMostrarModalCarregando] = useState(false);

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

  function carregando(estado) {
    setMostrarModalCarregando(estado);
  }

  return (
    <SistemaContext.Provider
      value={{
        concorda,
        carregando,
      }}
    >
      <ModalConcorda
        show={mostrarModalConcorda}
        resAviso={resAviso}
        mensagem={mensagem}
      />
      <ModalCarregando show={mostrarModalCarregando} />
      {props.children}
    </SistemaContext.Provider>
  );
}
