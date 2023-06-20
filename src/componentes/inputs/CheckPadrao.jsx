export default function CheckPadrao({ selecionado, aoMudar }) {
  return (
    <input
      role="button"
      className="form-check-input m-0"
      type="checkbox"
      checked={selecionado}
      onChange={(evento) => aoMudar(evento.target.checked)}
    />
  );
}
