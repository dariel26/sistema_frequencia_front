import { useContext } from "react";
import CardDefault from "../components/cards/CardDefault";
import { UserContext } from "../filters/User";

export default function MyAccount() {
  const user = useContext(UserContext);
  const mapInfoUser = user.infoUser.info;
  delete mapInfoUser.regrasHabilidades;
  const arrInfoUser = Object.entries(mapInfoUser);
  return (
    <CardDefault title="Minha Conta">
      <div className="row">
        {arrInfoUser?.map((arrInfo) => {
          const title =
            arrInfo[0] === "nome"
              ? "Nome"
              : arrInfo[0] === "email"
              ? "E-mail"
              : arrInfo[0] === "papel"
              ? "Papel"
              : "Matricula";
          const value = arrInfo[1];
          return value === undefined ? undefined : (
            <div className="mb-3 col-sm-4">
              <h6>{title}:</h6>
              <p className="ps-2">{value}</p>
            </div>
          );
        })}
        <hr />
        <form>
          <div class="mb-3">
            <label for="password1" class="form-label">
              Senha
            </label>
            <input type="password" class="form-control" id="password1" />
          </div>
          <div class="mb-3">
            <label for="password2" class="form-label">
              Confirmar Senha
            </label>
            <input type="password" class="form-control" id="password2" />
          </div>

          <button type="submit" class="btn btn-primary">
            Mudar
          </button>
        </form>
      </div>
    </CardDefault>
  );
}
