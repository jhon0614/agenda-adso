// Importamos hooks de React
import { useEffect, useState } from "react";
// Importamos las funciones de la API (capa de datos)
import {
  listarContactos,
  crearContacto,
  eliminarContactoPorId,
  actualizarContacto,
} from "./api";
// Importamos la configuración global de la aplicación
import { APP_INFO } from "./config";

// Importamos componentes hijos
import FormularioContacto from "./components/FormularioContacto";
import ContactoCard from "./components/ContactoCard";

function App() {
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(true); // Estado de carga mientras se consulta la API
  const [error, setError] = useState(""); // Estado para mostrar mensajes de error globales
  const [exito, setExito] = useState("");
  const [busqueda, setBusqueda] = useState(""); // Estado para búsqueda (solo en la vista "contactos")
  const [ordenAsc, setOrdenAsc] = useState(true); // true = A-Z, false = Z-A
  const [contactoEnEdicion, setContactoEnEdicion] = useState(null); // Estado del contacto que se está editando (o null si no hay edición)
  const [pagina, setPagina] = useState(1);
  const [vista, setVista] = useState("crear"); // NUEVO: estado de la vista actual ("crear" o "contactos")
  const contactoPorPagina = 3;

  //paginar contactos
  useEffect(() => {
    setPagina(1);
  }, [busqueda]);

  // Cargar contactos al iniciar
  useEffect(() => {
    const cargarContactos = async () => {
      try {
        setCargando(true);
        setError("");
        const data = await listarContactos();
        setContactos(data);
      } catch (error) {
        console.error("Error al cargar contactos:", error);
        setError(
          "No se pudieron cargar los contactos. Verifica que el servidor esté encendido e intenta de nuevo."
        );
      } finally {
        setCargando(false);
      }
    };
    cargarContactos();
  }, []);

  // Crear nuevo contacto
  const onAgregarContacto = async (nuevoContacto) => {
    try {
      setError("");
      const creado = await crearContacto(nuevoContacto);
      setContactos((prev) => [...prev, creado]);
      setExito("Contacto agregado correctamente");
      setTimeout(() => setExito(""), 3500);
    } catch (error) {
      console.error("Error al crear contacto:", error);
      setError(
        "No se pudo guardar el contacto. Verifica tu conexión o el estado del servidor e intenta nuevamente."
      );
      throw error;
    }
  };

  // Eliminar contacto por ID
  const onEliminarContacto = async (id) => {
    try {
      setError("");
      await eliminarContactoPorId(id);
      setContactos((prev) => prev.filter((c) => c.id !== id));

      setContactoEnEdicion((actual) => {
        actual && actual.id === id ? null : actual;
      });
      setExito("Contacto eliminado correctamente");
      setTimeout(() => setExito(""), 3500);
    } catch (error) {
      console.error("Error al eliminar contacto:", error);
      setError(
        "No se pudo eliminar el contacto. Vuelve a intentarlo o verifica el servidor."
      );
    }
  };

  // Editar contacto
  const onActualizarContacto = async (contactoActualizado) => {
    try {
      setError("");

      const actualizado = await actualizarContacto(
        contactoActualizado.id,
        contactoActualizado
      );
      setContactos((prev) =>
        prev.map((c) => (c.id === actualizado.id ? actualizado : c))
      );
      setContactoEnEdicion(null);
      setExito("Contacto editado con exito");
      setTimeout(() => setExito(""), 3500);
    } catch (error) {
      console.error("Error al actualizar el contacto:", error);
      setError(
        "No se pudo actualizar el contacto. Vuelve a intentarlo o verifica el servidor."
      );
      throw error;
    }
  };

  // Función para activar el modo edición al hacer clic en "Editar"
  const onEditarClick = (contacto) => {
    setContactoEnEdicion(contacto); // Guardamos el contacto que se va a editar
    setError("");
  };
  // Función para cancelar la edición y volver a modo "crear"
  const onCancelarEdicion = () => {
    setContactoEnEdicion(null);
  };

  // Cambiar a vista de contactos
  const irAVerContactos = () => {
    setVista("contactos");
    setContactoEnEdicion(null); // limpiamos cualquier edición previa
  };

  // Volver a vista de creación
  const irACrearContacto = () => {
    setVista("crear");
    setContactoEnEdicion(null);
    setBusqueda(""); // limpiamos el término de búsqueda
  };

  // Filtrar contactos según búsqueda
  const contactosFiltrados = contactos.filter((c) => {
    const termino = busqueda.toLowerCase();
    const nombre = c.nombre.toLowerCase();
    const correo = c.correo.toLowerCase();
    const etiqueta = (c.etiqueta || "").toLowerCase();
    return (
      nombre.includes(termino) ||
      correo.includes(termino) ||
      etiqueta.includes(termino)
    );
  });

  // Ordenar contactos filtrados por nombre
  const contactosOrdenados = [...contactosFiltrados].sort((a, b) => {
    const nombreA = a.nombre.toLowerCase();
    const nombreB = b.nombre.toLowerCase();
    if (nombreA < nombreB) return ordenAsc ? -1 : 1;
    if (nombreA > nombreB) return ordenAsc ? 1 : -1;
    return 0;
  });

  // Variables auxiliares para saber en qué vista estamos
  const estaEnVistaCrear = vista === "crear";
  const estaEnVistaContactos = vista === "contactos";

  const totalPaginas = Math.ceil(contactosOrdenados.length / contactoPorPagina);
  const inicio = (pagina - 1) * contactoPorPagina;
  const fin = inicio + contactoPorPagina;
  const contactosPaginados = contactosOrdenados.slice(inicio, fin);
  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  // JSX principal (layout tipo dashboard)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      {/* BARRA SUPERIOR */}
      <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
              A
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Proyecto ABP
              </p>
              <h1 className="text-sm md:text-base font-semibold text-slate-50">
                Agenda ADSO – ReactJS
              </h1>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
              SENA CTMA
            </p>
            <p className="text-xs text-slate-200">Ficha {APP_INFO.ficha}</p>
          </div>
        </div>
      </header>

      {/* Contenido principal en grid 2 columnas */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-10 pb-14">
        <div className="grid gap-8 md:grid-cols-[1.6fr,1fr] items-start">
          {/* COLUMNA IZQUIERDA: tarjeta principal (cambia según la vista) */}
          <div className="bg-white/95 rounded-3xl shadow-2xl border border-slate-100 px-6 py-7 md:px-8 md:py-8">
            {/* Encabezado dentro de la tarjeta */}
            <header className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                  {APP_INFO.titulo}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {APP_INFO.subtitulo}
                </p>

                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 border border-purple-100">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-xs font-medium text-purple-800">
                    JSON Server conectado · {contactos.length} contacto
                    {contactos.length !== 1 && "s"}
                  </span>
                </div>
              </div>

              {/* Botón para cambiar de vista */}
              <div className="flex flex-col items-end gap-2">
                <span className="text-[11px] uppercase tracking-[0.16em] block text-center text-gray-400">
                  {estaEnVistaCrear ? "Modo creación" : "Modo contactos"}
                </span>

                {estaEnVistaCrear ? (
                  <button
                    type="button"
                    onClick={irAVerContactos}
                    className="text-xs md:text-sm px-4 py-2 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    Ver contactos
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={irACrearContacto}
                    className="text-xs md:text-sm px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100"
                  >
                    Volver a crear contacto
                  </button>
                )}
              </div>
            </header>

            {/* mensajes globales */}
            {exito && (
              <div className="mb-4 rounded-xl bg-purple-50 border border-purple-200 px-4 py-3">
                <p className="text-sm font-medium text-purple-700">{exito}</p>
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                <p className="text-sm font-medium text-red-700">{error}</p>
              </div>
            )}

            {/* Contenido según la vista */}
            {cargando ? (
              <p className="text-sm text-gray-500">Cargando contactos...</p>
            ) : (
              <>
                {/* Vista CREAR → solo formulario */}
                {estaEnVistaCrear && (
                  <FormularioContacto
                    onAgregar={onAgregarContacto}
                    onActualizar={onActualizarContacto}
                    contactoEnEdicion={null}
                    onCancelarEdicion={onCancelarEdicion}
                  />
                )}

                {/* Vista CONTACTOS */}
                {estaEnVistaContactos && (
                  <>
                    {/* FORMULARIO SOLO SI EDITA */}
                    {contactoEnEdicion && (
                      <div className="mb-4">
                        <FormularioContacto
                          onAgregar={onAgregarContacto}
                          onActualizar={onActualizarContacto}
                          contactoEnEdicion={contactoEnEdicion}
                          onCancelarEdicion={onCancelarEdicion}
                        />
                      </div>
                    )}

                    {/* Buscar + ordenar + contador */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          className="w-full rounded-xl border-gray-300 focus:ring-purple-500 focus:border-purple-500 text-sm px-3 py-2"
                          placeholder="Buscar por nombre, correo o etiqueta..."
                          value={busqueda}
                          onChange={(e) => setBusqueda(e.target.value)}
                        />

                        <p className="mt-1 text-[11px] text-gray-500">
                          Mostrando {contactosOrdenados.length} de{" "}
                          {contactos.length} contacto
                          {contactos.length !== 1 && "s"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setOrdenAsc((prev) => !prev)}
                        className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-200 whitespace-nowrap"
                      >
                        {ordenAsc ? "Ordenar Z-A" : "Ordenar A-Z"}
                      </button>
                    </div>

                    {/* lista de contactos */}
                    <section className="space-y-3 md:space-y-4">
                      {contactosOrdenados.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          No se encontraron contactos que coincidan con la
                          búsqueda.
                        </p>
                      ) : (
                        contactosPaginados.map((c) => (
                          <ContactoCard
                            key={c.id}
                            nombre={c.nombre}
                            telefono={c.telefono}
                            correo={c.correo}
                            empresa={c.empresa}
                            etiqueta={c.etiqueta}
                            onEliminar={() => onEliminarContacto(c.id)}
                            onEditar={() => onEditarClick(c)}
                          />
                        ))
                      )}

                      {/* Paginación */}
                      {contactosFiltrados.length > 0 && (
                        <p className="text-sm text-gray-500 text-center">
                          Mostrando {inicio + 1}–
                          {Math.min(fin, contactosFiltrados.length)} de{" "}
                          {contactosFiltrados.length} resultados
                        </p>
                      )}

                      {/* paginacion */}
                      <nav className="flex items-center justify-center gap-3 mt-6">
                        {/* Anterior */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (pagina > 1) setPagina(pagina - 1);
                          }}
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                          disabled={pagina === 1}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path d="M15 6l-6 6l6 6" />
                          </svg>
                        </button>

                        {/* Números */}
                        {paginas.map((num) => (
                          <button
                            key={num}
                            onClick={(e) => {
                              e.preventDefault();
                              if (pagina !== num) setPagina(num);
                            }}
                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition
                            ${
                              pagina === num
                                ? "bg-purple-600 text-white border-purple-600 cursor-default"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                            }`}
                          >
                            {num}
                          </button>
                        ))}

                        {/* Siguiente */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            if (pagina < paginas.length) setPagina(pagina + 1);
                          }}
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                          disabled={pagina === paginas.length}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path d="M9 6l6 6l-6 6" />
                          </svg>
                        </button>
                      </nav>
                    </section>
                  </>
                )}
              </>
            )}
          </div>

          {/* COLUMNA DERECHA: Panel lateral PRO (igual en ambas vistas) */}
          <aside className="space-y-4 md:space-y-5">
            {/* Banner morado principal */}
            <div
              className="rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800 text-white
              p-6 shadow-xl flex flex-col justify-between min-h-[220px]"
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-purple-100/80">
                  Proyecto ABP
                </p>
                <h2 className="text-lg font-bold mt-2">
                  Agenda ADSO – Dashboard
                </h2>
                <p className="text-sm text-purple-100 mt-1">
                  CRUD completo con React, JSON Server, validaciones, búsqueda,
                  ordenamiento y edición.
                </p>
              </div>
              <div className="mt-6 space-y-2 text-sm">
                <p className="flex items-center justify-between">
                  <span className="text-purple-100">Contactos registrados</span>
                  <span className="font-semibold text-white text-base">
                    {contactos.length}
                  </span>
                </p>
                <p className="text-[11px] text-purple-100/80">
                  Instructor: Gustavo Bolaños – Curso: Desarrollo Web – ReactJS
                  (Agenda ADSO) Usa este proyecto como evidencia en tu
                  portafolio de Desarrollo Web – ReactJS.
                </p>
              </div>
            </div>
            {/* Tarjeta de tips de código */}
            <div className="rounded-2xl bg-white/90 border border-slate-100 p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900">
                Tips de código limpio
              </h3>
              <ul className="mt-2 text-xs text-gray-600 space-y-1">
                <li>• Nombra componentes según su responsabilidad.</li>
                <li>• Evita duplicar lógica, extrae funciones reutilizables.</li>
                <li>• Comenta la intención, no cada línea obvia.</li>
                <li>• Mantén archivos pequeños y coherentes.</li>
              </ul>
            </div>
            {/* Tarjeta SENA / motivacional */}
            <div
              className="rounded-2xl bg-slate-900 border border-slate-700 p-4 text-slate-100
            shadow-sm"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                SENA CTMA · ADSO
              </p>
              <p className="text-sm font-semibold mt-2">
                Desarrollo Web – ReactJS
              </p>
              <p className="text-xs text-slate-400 mt-3">
                “Pequeños proyectos bien cuidados valen más que mil ideas sin
                código. Agenda ADSO es tu carta de presentación como
                desarrollador.”
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default App;
