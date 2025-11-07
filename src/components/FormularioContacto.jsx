import { useState } from "react";

export default function FormularioContacto({ onAgregar }) {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    etiqueta: "",
    empresa: ""
  });

  // Handler genérico para inputs
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // Enviar datos al padre
  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.nombre || !form.telefono || !form.correo) return; // Validación mínima
    onAgregar(form); // Entregamos al padre
    setForm({ nombre: "", telefono: "", correo: "", etiqueta: "", empresa: "" }); // Reset
  };

  return (
    <form className="form-contacto" onSubmit={onSubmit}>
      <input
        name="nombre"
        value={form.nombre}
        onChange={onChange}
        placeholder="Nombre"
      />
      <input
        name="telefono"
        value={form.telefono}
        onChange={onChange}
        placeholder="Teléfono"
      />
      <input
        name="correo"
        value={form.correo}
        onChange={onChange}
        placeholder="Correo"
      />
      <input
        name="etiqueta"
        value={form.etiqueta}
        onChange={onChange}
        placeholder="Etiqueta opcional"
      />
      <input
        name="empresa"
        value={form.empresa}
        onChange={onChange}
        placeholder="Empresa opcional"
      />
      <button className="btn-agregar">Agregar contacto</button>
    </form>
  );
}
