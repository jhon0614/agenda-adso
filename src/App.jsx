// App.jsx
import "./App.css"; // Importamos estilos de la app
import ContactoCard from "./components/ContactoCard"; // Importamos el componente hijo

export default function App() {
  // Esta es nuestra "base de datos" inicial quemada en el código
  const contactos = [
    {
      id: 1,
      nombre: "Carolina Pérez",
      telefono: "300 123 4567",
      correo: "carolina@sena.edu.co",
      etiqueta: "Compañera",
    },
    {
      id: 2,
      nombre: "Juan Díaz",
      telefono: "301 987 6543",
      correo: "juan@sena.edu.co",
      etiqueta: "Instructor",
    },
    {
      id: 3,
      nombre: "Luisa Martínez",
      telefono: "320 555 7788",
      correo: "luisa@sena.edu.co",
      etiqueta: "Cliente",
    },
    {
      id: 4,
      nombre: "Juan Rios",
      telefono: "302 227 1630",
      correo: "juan@gmail.com",
      etiqueta: "Familiar",
    },
    {
      id: 5,
      nombre: "Juan David",
      telefono: "320 323 2954",
      correo: "mosquera@sena.edu.co",
      etiqueta: "Amigo",
    },
  ];

  return (
    <main className="app-container">
      <h1 className="app-title">Agenda ADSO 📒</h1>
      <p className="app-subtitle">Contactos guardados</p>

      {/* Recorremos el arreglo contactos y pintamos una tarjeta por cada uno */}
      {contactos.map((c) => (
        <ContactoCard
          key={c.id} // key única para React
          nombre={c.nombre} // prop nombre
          telefono={c.telefono} // prop telefono
          correo={c.correo} // prop correo
          etiqueta={c.etiqueta} // prop etiqueta (Cliente, Instructor, etc.)
        />
      ))}

      <p className="app-nota">
        (Versión 0.1 - solo lectura, sin agregar ni editar todavía)
      </p>
    </main>
  );
}
