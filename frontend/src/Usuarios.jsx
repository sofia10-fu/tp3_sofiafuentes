import { useEffect, useState } from "react"
import { useAuth } from "./Auth"

export function Usuarios() {
  const { fetchAuth, email: emailLogueado } = useAuth()
  const [usuarios, setUsuarios] = useState([])
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editUser, setEditUser] = useState(null)
  const [form, setForm] = useState({ nombre: "", email: "", password: "" })

  const fetchUsuarios = async () => {
    try {
      const response = await fetchAuth("http://localhost:3000/usuarios")
      const data = await response.json()
      if (!response.ok)
        throw new Error(data.error || "Error al obtener usuarios")
      setUsuarios(data.usuarios)
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchUsuarios()
    // eslint-disable-next-line
  }, [])

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAdd = () => {
    setForm({ nombre: "", email: "", password: "" })
    setEditUser(null)
    setShowForm(true)
  }

  const handleEdit = (usuario) => {
    setForm({ nombre: usuario.nombre, email: usuario.email, password: "" })
    setEditUser(usuario)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas borrar este usuario?")) return
    const response = await fetchAuth(`http://localhost:3000/usuarios/${id}`, {
      method: "DELETE",
    })
    if (response.ok) fetchUsuarios()
    else alert("Error al borrar usuario")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editUser) {
      // Editar usuario
      const response = await fetchAuth(
        `http://localhost:3000/usuarios/${editUser.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: form.nombre, email: form.email }),
        }
      )
      if (response.ok) {
        setShowForm(false)
        fetchUsuarios()
      } else {
        alert("Error al editar usuario")
      }
    } else {
      // Agregar usuario
      const response = await fetchAuth("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (response.ok) {
        setShowForm(false)
        fetchUsuarios()
      } else {
        alert("Error al agregar usuario")
      }
    }
  }

  return (
    <>
      <h1>Usuarios</h1>
      <button onClick={handleAdd}>Agregar usuario</button>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>
                  <button onClick={() => handleEdit(u)}>Editar</button>{" "}
                  {u.email !== emailLogueado && (
                    <button
                      onClick={() => handleDelete(u.id)}
                      style={{ background: "red" }}>
                      Borrar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <dialog open>
          <article>
            <h2>{editUser ? "Editar usuario" : "Agregar usuario"}</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Nombre:
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleInputChange}
                  required
                  maxLength={100}
                />
              </label>
              <label>
                Email:
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleInputChange}
                  required
                  maxLength={150}
                />
              </label>
              {!editUser && (
                <label>
                  Contraseña:
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleInputChange}
                    required
                    minLength={8}
                  />
                </label>
              )}
              <footer>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
                <button type="submit">
                  {editUser ? "Guardar" : "Agregar"}
                </button>
              </footer>
            </form>
          </article>
        </dialog>
      )}
    </>
  )
}
