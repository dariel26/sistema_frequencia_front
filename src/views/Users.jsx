import { useCallback, useEffect, useRef } from "react";
import { useContext } from "react";
import { useState } from "react";
import CardRadios from "../components/cards/CardRadios";
import TableAddSelectEdit from "../components/table/TableAddSelectEdit";
import { AlertContext } from "../filters/alert/Alert";
import { UserContext } from "../filters/User";
import apiSFE from "../service/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [indexRadio, setIndexRadio] = useState(0);
  const [refresh, setRefresh] = useState(0);

  const user = useContext(UserContext);
  const alert = useRef(useContext(AlertContext));

  const radios = ["Coordenadores", "Preceptores", "Alunos"];
  const objTitlesValuesC = [
    { title: "Nome", value: "nome" },
    { title: "E-mail", value: "email" },
    { title: "Papel", value: "papel" },
  ];

  const objTitlesValuesP = [
    { title: "Nome", value: "nome" },
    { title: "E-mail", value: "email" },
  ];

  const objTitlesValuesA = [
    { title: "Nome", value: "nome" },
    { title: "Matricula", value: "matricula" },
  ];

  const addKeysCP = ["nome", "email"];
  const addKeysA = ["nome", "matricula"];
  const editKeysC = ["nome", "email", "papel"];
  const editKeysP = ["nome", "email"];
  const editKeysA = ["nome", "matricula"];
  const uniqueKeyCP = "email";
  const uniqueKeyA = "matricula";

  const listaCoordenadores = useCallback(() => {
    apiSFE
      .listaCoordenadores(user.infoUser.token)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        alert.current.addAlert(err);
      });
  }, [user]);

  const listaPreceptores = useCallback(() => {
    apiSFE
      .listaPreceptor(user.infoUser.token)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        alert.current.addAlert(err);
      });
  }, [user]);

  const listaAlunos = useCallback(() => {
    apiSFE
      .listaAluno(user.infoUser.token)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        alert.current.addAlert(err);
      });
  }, [user]);

  useEffect(() => {
    if (indexRadio === 0) {
      listaCoordenadores();
    } else if (indexRadio === 1) {
      listaPreceptores();
    } else {
      listaAlunos();
    }
  }, [refresh, listaCoordenadores, listaAlunos, listaPreceptores, indexRadio]);

  function onDelete(usersToDelete) {
    const emailsCP = usersToDelete.map((u) => u.email);
    if (indexRadio === 0) {
      apiSFE
        .deletaCoordenador(user.infoUser.token, emailsCP)
        .then((_) => {
          setRefresh((r) => r + 1);
        })
        .catch((err) => {
          alert.current.addAlert(err);
        });
    } else if (indexRadio === 1) {
      apiSFE
        .deletaPreceptor(user.infoUser.token, emailsCP)
        .then((_) => {
          setRefresh((r) => r + 1);
        })
        .catch((err) => {
          alert.current.addAlert(err);
        });
    } else {
      apiSFE
        .deletaAluno(
          user.infoUser.token,
          usersToDelete.map((u) => u.matricula)
        )
        .then((_) => {
          setRefresh((r) => r + 1);
        })
        .catch((err) => {
          alert.current.addAlert(err);
        });
    }
  }

  function onAdd(usuarios) {
    const usersCP = usuarios.map((u) => ({
      nome: u.nome,
      email: u.email,
      papel: "",
      senha: u.email,
      estado: true,
    }));
    if (indexRadio === 0) {
      apiSFE
        .adicionaCoordenador(user.infoUser.token, usersCP)
        .then((_) => {
          setRefresh((r) => r + 1);
        })
        .catch((err) => {
          alert.current.addAlert(err);
        });
    } else if (indexRadio === 1) {
      apiSFE
        .adicionaPreceptor(user.infoUser.token, usersCP)
        .then((_) => {
          setRefresh((r) => r + 1);
        })
        .catch((err) => {
          alert.current.addAlert(err);
        });
    } else {
      apiSFE
        .adicionaAluno(
          user.infoUser.token,
          usuarios.map((u) => ({
            nome: u.nome,
            matricula: u.matricula,
            papel: "",
            senha: u.matricula,
            estado: true,
          }))
        )
        .then((_) => {
          setRefresh((r) => r + 1);
        })
        .catch((err) => {
          alert.current.addAlert(err);
        });
    }
  }

  function onEdit(values, newRole) {
    if (indexRadio === 0) {
      apiSFE
        .atualizarCoordenador(
          user.infoUser.token,
          values[0],
          newRole,
          values[1]
        )
        .then(() => {
          setRefresh((r) => r + 1);
        })
        .catch((err) => {
          alert.current.addAlert(err);
        });
    } else if (indexRadio === 1) {
      apiSFE
        .atualizarPreceptor(user.infoUser.token, values[0], values[1])
        .then(() => {
          setRefresh((r) => r + 1);
        })
        .catch((err) => {
          alert.current.addAlert(err);
        });
    } else {
      apiSFE
        .atualizarAluno(user.infoUser.token, values[0], values[1])
        .then(() => {
          setRefresh((r) => r + 1);
        })
        .catch((err) => {
          alert.current.addAlert(err);
        });
    }
  }

  return (
    <CardRadios radios={radios} newIndex={setIndexRadio}>
      <TableAddSelectEdit
        objsTitleValue={
          indexRadio === 0
            ? objTitlesValuesC
            : indexRadio === 1
            ? objTitlesValuesP
            : objTitlesValuesA
        }
        datas={users}
        onDelete={onDelete}
        addKeys={indexRadio === 0 || indexRadio === 1 ? addKeysCP : addKeysA}
        editKeys={
          indexRadio === 0
            ? editKeysC
            : indexRadio === 1
            ? editKeysP
            : editKeysA
        }
        uniqueKey={
          indexRadio === 0 || indexRadio === 1 ? uniqueKeyCP : uniqueKeyA
        }
        dropdownKey="papel"
        dropdownOptions={["ADMIN", "COORDENADOR(A)"]}
        onAdd={onAdd}
        onEdit={onEdit}
        edit
      />
    </CardRadios>
  );
}
