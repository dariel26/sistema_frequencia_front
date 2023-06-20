export default function BotaoTexto({ className, aoClicar, texto }) {
  return (
    <label
      role="button"
      className={"text-primary " + className}
      onClick={aoClicar}
    >
      {texto}
    </label>
  );
}
