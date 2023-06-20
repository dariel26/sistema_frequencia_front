import { useState } from "react";
import { useRef } from "react";
import { useContext, useEffect } from "react";
import TableAddSelectEdit from "../../components/table/TableAddSelectEdit";
import { AlertaContext } from "../../filters/alert/Alert";
import { UsuarioContext } from "../../filters/User";
import apiSFE from "../../service/api";

export function Coordenadores() {
  const [coordenadores, setCoordenadores] = useState([]);
  const [estado, setEstado] = useState(0);

  const usuario = useContext(UsuarioContext);
  const alertaRef = useRef(useContext(AlertaContext));

  const mapTitulosValores = [
    { title: "Nome", value: "nome" },
    { title: "E-mail", value: "email" },
    { title: "Papel", value: "papel" },
  ];

  const camposAdicao = ["nome", "email"];
  const camposEdicao = ["nome", "email", "papel", "senha"];
  const campoUnico = "email";

  useEffect(() => {
    apiSFE
      .listarCoordenadores(usuario.token)
      .then((res) => {
        setCoordenadores(res.data);
      })
      .catch((err) => {
        alertaRef.current.addAlert(err);
      });
  }, [usuario, estado]);

  function aoDeletar(coordenadores) {
    const ids = coordenadores.map((c) => c.id_coordenador);
    apiSFE
      .deletarCoordenadores(usuario.token, ids)
      .then((_) => {
        setEstado((r) => r + 1);
      })
      .catch((err) => {
        alertaRef.current.addAlert(err);
      });
  }

  function aoAdicionar(coordenadores) {
    const novosCoordenadores = coordenadores.map(({ nome, email }) => ({
      nome,
      email,
      senha: email,
    }));
    apiSFE
      .adicionarCoordenadores(usuario.token, novosCoordenadores)
      .then((_) => {
        setEstado((r) => r + 1);
      })
      .catch((err) => {
        alertaRef.current.addAlert(err);
      });
  }

  function aoEditar(valores, novoPapel, id_coordenador) {
    const coordenador = coordenadores.find(
      (c) => c.id_coordenador === id_coordenador
    );
    const novosDados = { id_coordenador };
    if (coordenador.nome !== valores[0]) {
      novosDados["nome"] = valores[0];
    }
    if (coordenador.email !== valores[1]) {
      novosDados["email"] = valores[1];
    }
    if (valores[3] === true) {
      novosDados["senha"] = valores[1];
    }
    if (coordenador.papel !== novoPapel) {
      novosDados["papel"] = novoPapel;
    }
    apiSFE
      .editarCoordenadores(usuario.token, [novosDados])
      .then(() => {
        setEstado((r) => r + 1);
      })
      .catch((err) => {
        alertaRef.current.addAlert(err);
      });
  }

  return (
    <TableAddSelectEdit
      objsTitleValue={mapTitulosValores}
      datas={coordenadores}
      onDelete={aoDeletar}
      addKeys={camposAdicao}
      editKeys={camposEdicao}
      uniqueKey={campoUnico}
      dropdownKey="papel"
      checkboxKey="senha"
      idKey="id_coordenador"
      dropdownOptions={["ADMIN", "COORDENADOR(A)"]}
      onAdd={aoAdicionar}
      onEdit={aoEditar}
      edit
    />
  );
}
