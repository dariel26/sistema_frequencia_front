import { useState } from "react";
import { useRef } from "react";
import { useContext, useEffect } from "react";
import TableAddSelectEdit from "../../components/table/TableAddSelectEdit";
import { AlertaContext } from "../../filters/alert/Alert";
import { UsuarioContext } from "../../filters/User";
import apiSFE from "../../service/api";

export function Preceptores() {
  const [preceptores, setPreceptores] = useState([]);
  const [estado, setEstado] = useState(0);

  const usuario = useContext(UsuarioContext);
  const alertaRef = useRef(useContext(AlertaContext));

  const mapTitulosValores = [
    { title: "Nome", value: "nome" },
    { title: "E-mail", value: "email" },
  ];
  const camposAdicao = ["nome", "email"];
  const camposEdicao = ["nome", "email", "senha"];
  const campoUnico = "email";

  useEffect(() => {
    apiSFE
      .listarPreceptores(usuario.token)
      .then((res) => {
        setPreceptores(res.data);
      })
      .catch((err) => {
        alertaRef.current.addAlert(err);
      });
  }, [usuario, estado]);

  function aoDeletar(preceptores) {
    const ids = preceptores.map((p) => p.id_preceptor);
    apiSFE
      .deletarPreceptores(usuario.token, ids)
      .then((_) => {
        setEstado((r) => r + 1);
      })
      .catch((err) => {
        alertaRef.current.addAlert(err);
      });
  }

  function aoAdicionar(preceptores) {
    const novosPreceptores = preceptores.map(({ nome, email }) => ({
      nome,
      email,
      senha: email,
    }));
    apiSFE
      .adicionarPreceptores(usuario.token, novosPreceptores)
      .then((_) => {
        setEstado((r) => r + 1);
      })
      .catch((err) => {
        alertaRef.current.addAlert(err);
      });
  }

  function aoEditar(valores, _, id_preceptor) {
    const preceptor = preceptores.find((p) => p.id_preceptor === id_preceptor);
    const novosDados = { id_preceptor };
    if (preceptor.nome !== valores[0]) {
      novosDados["nome"] = valores[0];
    }
    if (preceptor.email !== valores[1]) {
      novosDados["email"] = valores[1];
    }
    if (valores[2] === true) {
      novosDados["senha"] = valores[1];
    }
    apiSFE
      .editatPreceptores(usuario.token, [novosDados])
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
      datas={preceptores}
      onDelete={aoDeletar}
      addKeys={camposAdicao}
      editKeys={camposEdicao}
      uniqueKey={campoUnico}
      dropdownKey="papel"
      checkboxKey="senha"
      idKey="id_preceptor"
      onAdd={aoAdicionar}
      onEdit={aoEditar}
      edit
    />
  );
}
