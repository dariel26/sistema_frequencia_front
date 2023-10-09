import { useEffect, useState, useRef, useContext, useCallback } from "react";
import { UsuarioContext, tiposUsuario, SistemaContext } from "../contexts";
import apiSFE from "../service/api";
import { CardSimples, InputSelecao } from "../componentes";
import { Col, FormCheck, Row, Spinner } from "react-bootstrap";
import { errors } from "../utils";
import {
  IoNotifications,
  IoNotificationsOff,
  IoShareOutline,
} from "react-icons/io5";
import { GrSettingsOption } from "react-icons/gr";
import { CgAddR } from "react-icons/cg";
import { BsThreeDotsVertical } from "react-icons/bs";
import { ANDROID, IPHONE } from "../contexts/sistema/Sistema";

export default function MinhaConta() {
  const [senhaPadrao, setSenhaPadrao] = useState(false);
  const [senha, setSenha] = useState("");
  const [senhaConfirmada, setSenhaConfirmada] = useState("");
  const [subscricaoOk, setSubscricaoOk] = useState(false);
  const [permissaoNotificacaoOk, setPermissaoNotificacaoOk] = useState(false);
  const [configurando, setConfigurando] = useState(false);

  const { carregando } = useRef(useContext(SistemaContext)).current;
  const usuario = useContext(UsuarioContext);
  const { sucesso, error, aviso, concorda, tipoDeSistema } = useRef(
    useContext(SistemaContext)
  ).current;

  const pedePermissao = useCallback(() => {
    if (tipoDeSistema(IPHONE)) concorda(iosPemissao);
    if (!window.Notification) return;
    setConfigurando(true);
    Notification.requestPermission()
      .then((permissao) => {
        if (permissao === "granted") {
          setPermissaoNotificacaoOk(true);
          if ("serviceWorker" in navigator && "PushManager" in window) {
            navigator.serviceWorker.ready
              .then((registro) => {
                return registro.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: process.env.REACT_APP_VAPID_KEY,
                });
              })
              .then((subscricao) => {
                apiSFE
                  .subscrever(usuario.token, {
                    id_usuario: usuario.id_usuario,
                    subscricao,
                  })
                  .then(() => setSubscricaoOk(true))
                  .catch((err) => error(errors.filtraMensagem(err)));
              })
              .catch(() =>
                error(
                  "Algo deu errado ao tentar configurar as notificações, tente novamente mais tarde"
                )
              );
          } else {
            concorda(
              `O sistema não possui os requisitos mínimos para o envio de notificações`
            );
          }
        } else if (permissao === "denied") {
          //TODO Melhorar o texto como foi feito na permissão para localização
          concorda(
            tipoDeSistema(IPHONE)
              ? iosNotificacao
              : tipoDeSistema(ANDROID)
              ? androidNotificacao
              : outroNotificacao
          );
        }
      })
      .catch(() => error("Houve um erro ao pedir permissão para notificações"))
      .finally(() => setConfigurando(false));
  }, [usuario, concorda, error, tipoDeSistema]);

  const lidaComNotificacoes = useCallback(() => {
    if (!("Notification" in window)) return;
    else if (Notification.permission === "granted")
      setPermissaoNotificacaoOk(true);
    else if (Notification.permission !== "denied") pedePermissao();
  }, [pedePermissao]);

  useEffect(() => {
    carregando(true);
    if (usuario.login === undefined) return;
    if (usuario.token === undefined) return;

    apiSFE
      .possuiSubscricao(usuario.token)
      .then((res) => {
        if (res.data) setSubscricaoOk(true);
        else setSubscricaoOk(false);
      })
      .catch((err) => errors.filtraMensagem(err));

    lidaComNotificacoes();

    apiSFE
      .usuarioPadrao(usuario.token)
      .then((res) => setSenhaPadrao(res.data.padrao))
      .catch((err) => error(errors.filtraMensagem(err)))
      .finally(() => carregando(false));
  }, [usuario, carregando, error, lidaComNotificacoes]);

  const onSubmit = (e) => {
    e.preventDefault();
    const token = usuario.token;
    if (senha !== senhaConfirmada) {
      aviso("As senhas devem ser iguais");
    } else if (senha.length < 3) {
      aviso("A senha deve conter no mínimo 3 carateres");
    } else {
      const novosDados = { id_usuario: usuario.id_usuario, senha };
      apiSFE
        .mudarSenha(token, novosDados)
        .then(() => {
          sucesso("Senha modificada!");
          setSenhaPadrao(false);
        })
        .catch((err) => error(errors.filtraMensagem(err)));
    }
  };

  function aoMudarPermissaoNotificacao(e) {
    const habilitar = e.target.checked;
    if (habilitar) pedePermissao();
    else {
      setConfigurando(true);
      apiSFE
        .revogaSubscricao(usuario.token, usuario.id_usuario)
        .then(() => {
          setSubscricaoOk(false);
        })
        .catch((err) => error(errors.filtraMensagem(err)))
        .finally(() => setConfigurando(false));
    }
  }

  return (
    <CardSimples titulo="Minha Conta">
      <Row className="justify-content-center m-0">
        <Col sm="12" className="border-bottom mb-2">
          <span className="fs-5 fw-bold">Informações pessoais</span>
        </Col>
        <Col sm="4" className="mb-3">
          <span>Nome: {usuario.nome}</span>
        </Col>
        <Col sm="4" className="mb-3">
          <span>Login: {usuario.login}</span>
        </Col>
        <Col sm="4" className="mb-3">
          {usuario.tipo === tiposUsuario.coordenador ? (
            <InputSelecao
              campoSelecao={"valor"}
              textoReferencia="Papel do usuário"
              opcoesSelecao={usuario.papeis.map((p) => ({ valor: p }))}
              textoBotao="Mudar"
              aoSubmeter={usuario.mudarPapelAtual}
              textoInicial={usuario.papel_atual}
            />
          ) : (
            <span>Papel atual: {usuario.papel_atual}</span>
          )}
        </Col>
        <Col className="border-bottom mb-2" sm="12">
          <span className="fs-5 fw-bold">Configurações do sistema</span>
          {configurando && (
            <Spinner animation="grow" size="sm" className="ms-2" />
          )}
        </Col>
        <Col sm="12" className="mb-4">
          <FormCheck
            checked={subscricaoOk && permissaoNotificacaoOk}
            onChange={aoMudarPermissaoNotificacao}
            label={
              subscricaoOk ? (
                <span>
                  Quero receber notificações <IoNotifications size={21} />
                </span>
              ) : (
                <span>
                  Não quero receber notificações{" "}
                  <IoNotificationsOff size={21} />
                </span>
              )
            }
          />
        </Col>
        {senhaPadrao ? (
          <h5 className="text-danger text-center">
            Parece que sua conta está com uma senha padrão, por segurança mude
            sua senha
          </h5>
        ) : undefined}
        {senhaPadrao ? (
          <form className="d-flex flex-column" style={{ maxWidth: "300px" }}>
            <div className="mb-3">
              <label htmlFor="password1" className="form-label">
                Nova senha
              </label>
              <input
                type="password"
                autoComplete="new-password"
                className="form-control"
                id="password1"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password2" className="form-label">
                Confirmar nova senha
              </label>
              <input
                type="password"
                autoComplete="new-password"
                className="form-control"
                id="password2"
                value={senhaConfirmada}
                onChange={(e) => {
                  setSenhaConfirmada(e.target.value);
                }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              onClick={onSubmit}
            >
              Mudar
            </button>
          </form>
        ) : undefined}
      </Row>
    </CardSimples>
  );
}

const iosPemissao = (
  <span>
    Para poder receber notificações você deve ter este sistema instalado no seu
    dispositivo.{" "}
    <span className="text-primary">Caso já esteja, ignore esta mensagem.</span>
    <p>
      1- No navegador, com a aplicação aberta, clique no icone de{" "}
      <strong>compartilhar</strong> <IoShareOutline size={20} color="#4F83F5" />
      .
    </p>
    <p>
      2- Busque por <strong>Adicionar à Tela Inicial</strong>{" "}
      <CgAddR size={20} />.
    </p>
    <p>
      3- Confirme clicando em <strong>adicionar</strong>.
    </p>
  </span>
);

const iosNotificacao = (
  <span>
    O sistema não possui permissão para notificações.
    <p>
      1- Vá até as <strong>configurações</strong> <GrSettingsOption /> do seu
      dispositivo.
    </p>
    <p>2- Busque pelo icone deste aplicativo e clique nele.</p>
    <p>3- Prosiga para permitir notificações.</p>
  </span>
);
const androidNotificacao = (
  <span>
    O sistema não possui permissão para notificações.
    <p>1- Abra o navegador e acesse o site da aplicação.</p>
    <p>
      2- Clique nos <strong>três pontos</strong> <BsThreeDotsVertical /> no
      canto superior direito do navegador.
    </p>{" "}
    <p>
      3- Siga os passos: <strong> Configurações</strong> -{" "}
      <strong>Notificações</strong> - <strong>Apps da Web</strong>.
    </p>
    <p>4- Permita mostrar notificações.</p>
  </span>
);
const outroNotificacao = <span>
  O sistema não possui permissão para notificações.
  Entre nas configurações do seu navegador ou dispositivo e
  permita o envio de notificações para este site ou aplicativo.
</span>;
