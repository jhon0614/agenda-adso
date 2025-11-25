import { useEffect, useState } from "react";

// Servicios API (JSON Server)
import { listarContactos, crearContacto, eliminarContactoPorId } from "./api";

// Componentes
import FormularioContacto from "./components/FormularioContacto";
import ContactoCard from "./components/ContactoCard";

// Importamos la configuración global de la app
import { APP_INFO } from "./config";

function App() {
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

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
    } catch (error) {
      console.error("Error al eliminar contacto:", error);
      setError(
        "No se pudo eliminar el contacto. Vuelve a intentarlo o verifica el servidor."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* HEADER */}
        <header className="mb-8">
          <p className="text-xs tracking-[0.3em] text-gray-500 uppercase">
            Desarrollo Web ReactJS Ficha {APP_INFO.ficha}
          </p>
          <h1 className="text-4xl font-extrabold text-gray-900 mt-2">
            {APP_INFO.titulo}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {APP_INFO.subtitulo}
          </p>
        </header>
        
        {/* MENSAJE GLOBAL */}
        {exito && (
          <div className="mb-4 rounded-xl bg-purple-50 border border-purgple-200 px-4 py-3">
            <p className="text-sm font-medium text-purple-700">{exito}</p>
          </div>
        )}
      {/* ERROR GLOBAL */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        {/* LOADING */}
        {cargando ? (
          <p className="text-sm text-gray-500">Cargando contactos...</p>
        ) : (
          <>
            {/* FORMULARIO */}
            <FormularioContacto onAgregar={onAgregarContacto} />

            {/* LISTA DE CONTACTOS */}
            <section className="space-y-4">
              {contactos.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Aún no tienes contactos registrados. Agrega el primero usando
                  el formulario superior.
                </p>
              ) : (
                contactos.map((c) => (
                  <ContactoCard
                    key={c.id}
                    nombre={c.nombre}
                    telefono={c.telefono}
                    correo={c.correo}
                    empresa={c.empresa}
                    etiqueta={c.etiqueta}
                    onEliminar={() => onEliminarContacto(c.id)}
                  />
                ))
              )}
            </section>
          </>
        )}

        {/* FOOTER */}
        <footer className="mt-8 text-xs text-gray-400">
          <p>Desarrollo Web – ReactJS | Proyecto Agenda ADSO</p>
          <p>Instructor: Gustavo Adolfo Bolaños Dorado</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
