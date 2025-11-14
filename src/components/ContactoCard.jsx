export default function ContactoCard({
  nombre,
  telefono,
  correo,
  etiqueta,
  empresa,
  onEliminar,
}) {
  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 flex items-start justify-between">
      {/* Información */}
      <div className="space-y-1">
        {/* Nombre */}
        <h3 className="text-xl font-semibold text-gray-800">{nombre}</h3>

        {/* Teléfono */}
        <p className="text-gray-600 text-sm flex items-center gap-2">
          <span className="text-purple-500 text-lg">📞</span>
          {telefono}
        </p>

        {/* Correo */}
        <p className="text-gray-600 text-sm flex items-center gap-2">
          <span className="text-purple-500 text-lg">✉️</span>
          {correo}
        </p>

        {/* Empresa */}
        {empresa && (
          <p className="text-gray-600 text-sm flex items-center gap-2">
            <span className="text-purple-500 text-lg">🏬</span>
            {empresa}
          </p>
        )}

        {/* Etiqueta */}
        {etiqueta && (
          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full mt-2">
            {etiqueta}
          </span>
        )}
      </div>

      {/* Botón eliminar */}
      <button
        onClick={onEliminar}
        className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg shadow transition"
      >
        Eliminar
      </button>
    </div>
  );
}
