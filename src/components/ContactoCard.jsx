// ContactoCard.jsx
// Este componente muestra un contacto de la agenda.
// Recibe datos (props): nombre, telefono, correo, etiqueta.

export default function ContactoCard({
  id,
  nombre,
  telefono,
  correo,
  etiqueta,
  onDelete,
}) {
  return (
    <article className="tarjeta-contacto">
      <h3>{nombre}</h3>
      {etiqueta && <p className="tag">{etiqueta}</p>}
      <p>📞 {telefono}</p>
      {correo && <p>✉️ {correo}</p>}

      <div className="acciones">
        <button
          type="button"
          className="btn-eliminar"
          onClick={() => onDelete(id)}
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}
