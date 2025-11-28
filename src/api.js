// Importamos la URL base desde config.js
import { API_BASE_URL } from "./config";

// GET: listar contactos
export async function listarContactos() {
  const res = await fetch(API_BASE_URL);
  if (!res.ok) throw new Error("Error al listar contactos");
  return res.json(); // array de contactos
}

// POST: crear contacto
export async function crearContacto(data) {
  const res = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear el contacto");
  return res.json(); // contacto creado con id
}

// PUT: actualizar contacto
export async function actualizarContacto(id, data) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar el contacto");
  return res.json(); // Devuelve el contacto actualizado
}

// DELETE: eliminar contacto por id
export async function eliminarContactoPorId(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar el contacto");
  return true;
}
