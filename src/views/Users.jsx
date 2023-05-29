import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import CardRadios from "../components/CardRadios";
import TableAddSelectEdit from "../components/table/TableAddSelectEdit";
import { AlertContext } from "../filters/alert/Alert";
import { UserContext } from "../filters/User";
import apiSFE from "../service/api";

export default function Users() {
  const [users, setCoordenadores] = useState([]);
  const [indexRadio, setIndexRadio] = useState(0);
  const [refresh, setRefresh] = useState(0);

  const user = useContext(UserContext);
  const alert = useContext(AlertContext);

  const radios = ["Coordenadores", "Preceptores", "Alunos"];
  const objTitlesValuesCP = [
    { title: "Nome", value: "nome" },
    { title: "E-mail", value: "email" },
    { title: "Papel", value: "papel" },
  ];

  const objTitlesValuesA = [
    { title: "Nome", value: "nome" },
    { title: "Matricula", value: "matricula" },
    { title: "Papel", value: "papel" },
  ];

  const addKeysCP = ["nome", "email"];
  const addKeysA = ["nome", "matricula"];
  const editKeysCP = ["nome", "email", "papel"];
  const editKeysA = ["nome", "matricula"];
  const uniqueKeyCP = "email";
  const uniqueKeyA = "matricula";

  useEffect(() => {
    apiSFE
      .listaCoordenadores(user.infoUser.token)
      .then((res) => {
        setCoordenadores(res.data);
      })
      .catch((_) => {
        alert.addAlert({
          title: "Ops!",
          message: "Parece que algo deu errado, tente novamente mais tarde",
          time: 2000,
        });
      });
  }, [alert, user, refresh]);

  function onDelete(coordenadoresToDelete) {
    for (let c of coordenadoresToDelete) {
      apiSFE
        .deletaCoordenador(user.infoUser.token, c.email)
        .then((_) => {
          setRefresh((r) => r + 1);
        })
        .catch((err) => {
          console.log(err);
          alert.addAlert({
            title: "Erro",
            message: `Não foi possível deletar o coordenador com email ${c.email}`,
            danger: true,
            time: 10000,
            key: c.email,
          });
        });
    }
  }

  function onAdd(coordenadores) {
    for (let c of coordenadores) {
      const coordenador = {
        nome: c[0],
        email: c[1],
        papel: "",
        senha: c[1],
        estado: true,
      };
      apiSFE
        .adicionaCoordenador(user.infoUser.token, coordenador)
        .then((_) => {
          setRefresh((r) => r + 1);
        })
        .catch((err) => {
          console.log(err);
          alert.addAlert({
            title: "Erro",
            message: `Não foi possível adicionar o coordenador com email ${coordenador.email}`,
            danger: true,
            time: 10000,
            key: coordenador.email,
          });
        });
    }
  }

  function onEdit(values, newRole) {
    apiSFE
      .atualizarCoordenador(user.infoUser.token, values[0], newRole, values[1])
      .then(() => {
        alert.addAlert({
          title: "Usuario atualizado",
          time: 3000,
          sucess: true,
          key: "usuariovalido",
        });
        setRefresh((r) => r + 1);
      })
      .catch((err) => {
        console.log(err);
        alert.addAlert({
          title: "Error",
          message: "Não foi possível atualizar o usuário",
          time: 5000,
          danger: true,
          key: "usuarioinvalido",
        });
      });
  }

  return (
    <CardRadios radios={radios} newIndex={setIndexRadio}>
      <TableAddSelectEdit
        objsTitleValue={
          indexRadio === 0 || indexRadio === 1
            ? objTitlesValuesCP
            : objTitlesValuesA
        }
        datas={users}
        onDelete={onDelete}
        addKeys={indexRadio === 0 || indexRadio === 1 ? addKeysCP : addKeysA}
        editKeys={indexRadio === 0 || indexRadio === 1 ? editKeysCP : editKeysA}
        uniqueKey={
          indexRadio === 0 || indexRadio === 1 ? uniqueKeyCP : uniqueKeyA
        }
        dropdownKey="papel"
        dropdownOptions={["ADMIN", "COORDENADOR(A)"]}
        onAdd={onAdd}
        onEdit={onEdit}
      />
    </CardRadios>
  );
}
