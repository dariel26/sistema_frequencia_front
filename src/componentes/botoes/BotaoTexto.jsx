export default function BotaoTexto({ className, aoClicar, texto, visivel }) {
  return visivel ? (
    <label
      role="button"
      className={"text-primary " + className}
      onClick={aoClicar}
    >
      {texto}
    </label>
  ) : undefined;
}
