import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import CardRadios from "../components/CardRadios";
import TableAddSelectEdit from "../components/TableAddSelectEdit";
import { AlertContext } from "../filters/alert/Alert";
import { UserContext } from "../filters/User";
import apiSFE from "../service/api";

export default function Users() {
  const [coordenadores, setCoordenadores] = useState([]);
  const [indexRadio, setIndexRadio] = useState(0);

  const user = useContext(UserContext);
  const alert = useContext(AlertContext);

  const radios = ["Coordenadores", "Preceptores", "Alunos"];
  const objTitlesValues = [
    { title: "Nome", value: "nome" },
    { title: "E-mail", value: "email" },
    { title: "Papel", value: "papel" },
  ];

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
  }, [alert, user]);

  function onDelete(coordenadoresToDelete) {
    //Aqui se chama a api para mudar o estado para false dos coordenadoresToDelete
    console.log(coordenadoresToDelete);
  }

  return (
    <CardRadios radios={radios} newIndex={setIndexRadio}>
      <TableAddSelectEdit
        objsTitleValue={objTitlesValues}
        datas={coordenadores}
        onDelete={onDelete}
      />
    </CardRadios>
  );
}
