import { useState } from "react";
import { useRef } from "react";
import { useContext, useEffect } from "react";
import TableAddSelectEdit from "../../components/table/TableAddSelectEdit";
import { AlertaContext } from "../../filters/alert/Alert";
import { UsuarioContext } from "../../filters/User";
import apiSFE from "../../service/api";

export function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [estado, setEstado] = useState(0);

  const usuario = useContext(UsuarioContext);
  const alertaRef = useRef(useContext(AlertaContext));

  const mapTitulosValores = [
    { title: "Nome", value: "nome" },
    { title: "Matricula", value: "matricula" },
  ];

  const camposAdicao = ["nome", "matricula"];
  const camposEdicao = ["nome", "matricula", "senha"];
  const campoUnico = "matricula";

  useEffect(() => {
    apiSFE
      .listarAlunos(usuario.token)
      .then((res) => {
        setAlunos(res.data);
      })
      .catch((err) => {
        alertaRef.current.addAlert(err);
      });
  }, [usuario, estado]);

  function aoDeletar(alunos) {
    const ids = alunos.map((a) => a.id_aluno);
    apiSFE
      .deletarAlunos(usuario.token, ids)
      .then((_) => {
        setEstado((e) => e + 1);
      })
      .catch((err) => {
        alertaRef.current.addAlert(err);
      });
  }

  function aoAdicionar(alunos) {
    const novosAlunos = alunos.map(({ nome, matricula }) => ({
      nome,
      matricula,
      senha: matricula,
    }));
    apiSFE
      .adicionarAlunos(usuario.token, novosAlunos)
      .then((_) => {
        setEstado((e) => e + 1);
      })
      .catch((err) => {
        alertaRef.current.addAlert(err);
      });
  }

  function aoEditar(valores, _, id_aluno) {
    const aluno = alunos.find((a) => a.id_aluno === id_aluno);
    const novosDados = { id_aluno };
    if (aluno.nome !== valores[0]) {
      novosDados["nome"] = valores[0];
    }
    if (aluno.matricula !== valores[1]) {
      novosDados["matricula"] = valores[1];
    }
    if (valores[2] === true) {
      novosDados["senha"] = valores[1];
    }
    apiSFE
      .editarAlunos(usuario.token, [novosDados])
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
      datas={alunos}
      onDelete={aoDeletar}
      addKeys={camposAdicao}
      editKeys={camposEdicao}
      uniqueKey={campoUnico}
      checkboxKey="senha"
      idKey="id_aluno"
      onAdd={aoAdicionar}
      onEdit={aoEditar}
      edit
    />
  );
}
