import { useEffect, useState } from "react"
import { useAuth } from "./Auth"

export const Conductores = () => {
  const { fetchAuth } = useAuth()
  const [conductores, setConductores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editConductor, setEditConductor] = useState(null)
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    licencia: "",
    licencia_vencimiento: "",
  })

  const fetchConductores = async () => {
    setLoading(true)
    try {
      const response = await fetchAuth("http://localhost:3000/conductores")
      const data = await response.json()
      if (!response.ok)
        throw new Error(data.error || "Error al obtener conductores")
      setConductores(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConductores()
  }, [])

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAdd = () => {
    setForm({
      nombre: "",
      apellido: "",
      dni: "",
      licencia: "",
      licencia_vencimiento: "",
    })
    setEditConductor(null)
    setShowForm(true)
  }

  const handleEdit = (c) => {
    setForm({
      nombre: c.nombre,
      apellido: c.apellido,
      dni: c.dni,
      licencia: c.licencia,
      licencia_vencimiento: c.licencia_vencimiento,
    })
    setEditConductor(c)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas borrar este conductor?")) return
    const response = await fetchAuth(
      `http://localhost:3000/conductores/${id}`,
      { method: "DELETE" }
    )
    if (response.ok) fetchConductores()
    else alert("Error al borrar conductor")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editConductor) {
      const response = await fetchAuth(
        `http://localhost:3000/conductores/${editConductor.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      )
      if (response.ok) {
        setShowForm(false)
        fetchConductores()
      } else {
        alert("Error al editar conductor")
      }
    } else {
      const response = await fetchAuth("http://localhost:3000/conductores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (response.ok) {
        setShowForm(false)
        fetchConductores()
      } else {
        alert("Error al agregar conductor")
      }
    }
  }

  return (
    <>
      <h1>Conductores</h1>
      <button onClick={handleAdd}>Agregar conductor</button>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>DNI</th>
              <th>Licencia</th>
              <th>Vencimiento</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {conductores.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nombre}</td>
                <td>{c.apellido}</td>
                <td>{c.dni}</td>
                <td>{c.licencia}</td>
                <td>{c.licencia_vencimiento}</td>
                <td>
                  <button onClick={() => handleEdit(c)}>Editar</button>{" "}
                  <button
                    onClick={() => handleDelete(c.id)}
                    style={{ color: "red" }}>
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <dialog open>
          <article>
            <h2>{editConductor ? "Editar conductor" : "Agregar conductor"}</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Nombre:
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                />
              </label>
              <label>
                Apellido:
                <input
                  name="apellido"
                  value={form.apellido}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                />
              </label>
              <label>
                DNI:
                <input
                  name="dni"
                  value={form.dni}
                  onChange={handleInputChange}
                  required
                  maxLength={20}
                />
              </label>
              <label>
                Licencia:
                <input
                  name="licencia"
                  value={form.licencia}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                />
              </label>
              <label>
                Vencimiento:
                <input
                  name="licencia_vencimiento"
                  type="date"
                  value={form.licencia_vencimiento}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <footer>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
                <button type="submit">
                  {editConductor ? "Guardar" : "Agregar"}
                </button>
              </footer>
            </form>
          </article>
        </dialog>
      )}
    </>
  )
}
