import { useEffect, useState } from "react"
import { useAuth } from "./Auth"

export const Viajes = () => {
  const { fetchAuth } = useAuth()
  const [viajes, setViajes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editViaje, setEditViaje] = useState(null)
  const [form, setForm] = useState({
    vehiculo_id: "",
    conductor_id: "",
    fecha_salida: "",
    fecha_llegada: "",
    origen: "",
    destino: "",
    kilometros: "",
  })

  const fetchViajes = async () => {
    setLoading(true)
    try {
      const response = await fetchAuth("http://localhost:3000/viajes")
      const data = await response.json()
      if (!response.ok)
        throw new Error(data.message || "Error al obtener viajes")
      setViajes(data.data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchViajes()
  }, [])

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAdd = () => {
    setForm({
      vehiculo_id: "",
      conductor_id: "",
      fecha_salida: "",
      fecha_llegada: "",
      origen: "",
      destino: "",
      kilometros: "",
    })
    setEditViaje(null)
    setShowForm(true)
  }

  const handleEdit = (v) => {
    setForm({
      vehiculo_id: v.vehiculo_id,
      conductor_id: v.conductor_id,
      fecha_salida: v.fecha_salida,
      fecha_llegada: v.fecha_llegada,
      origen: v.origen,
      destino: v.destino,
      kilometros: v.kilometros,
    })
    setEditViaje(v)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas borrar este viaje?")) return
    const response = await fetchAuth(`http://localhost:3000/viajes/${id}`, {
      method: "DELETE",
    })
    if (response.ok) fetchViajes()
    else alert("Error al borrar viaje")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editViaje) {
      const response = await fetchAuth(
        `http://localhost:3000/viajes/${editViaje.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      )
      if (response.ok) {
        setShowForm(false)
        fetchViajes()
      } else {
        alert("Error al editar viaje")
      }
    } else {
      const response = await fetchAuth("http://localhost:3000/viajes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (response.ok) {
        setShowForm(false)
        fetchViajes()
      } else {
        alert("Error al agregar viaje")
      }
    }
  }

  return (
    <>
      <h1>Viajes</h1>
      <button onClick={handleAdd}>Agregar viaje</button>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Vehículo</th>
              <th>Conductor</th>
              <th>Salida</th>
              <th>Llegada</th>
              <th>Origen</th>
              <th>Destino</th>
              <th>Kilómetros</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {viajes.map((v) => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.vehiculo_id}</td>
                <td>{v.conductor_id}</td>
                <td>{v.fecha_salida}</td>
                <td>{v.fecha_llegada}</td>
                <td>{v.origen}</td>
                <td>{v.destino}</td>
                <td>{v.kilometros}</td>
                <td>
                  <button onClick={() => handleEdit(v)}>Editar</button>{" "}
                  <button
                    onClick={() => handleDelete(v.id)}
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
            <h2>{editViaje ? "Editar viaje" : "Agregar viaje"}</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Vehículo ID:
                <input
                  name="vehiculo_id"
                  value={form.vehiculo_id}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Conductor ID:
                <input
                  name="conductor_id"
                  value={form.conductor_id}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Fecha salida:
                <input
                  name="fecha_salida"
                  type="datetime-local"
                  value={form.fecha_salida}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Fecha llegada:
                <input
                  name="fecha_llegada"
                  type="datetime-local"
                  value={form.fecha_llegada}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Origen:
                <input
                  name="origen"
                  value={form.origen}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Destino:
                <input
                  name="destino"
                  value={form.destino}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Kilómetros:
                <input
                  name="kilometros"
                  value={form.kilometros}
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
                  {editViaje ? "Guardar" : "Agregar"}
                </button>
              </footer>
            </form>
          </article>
        </dialog>
      )}
    </>
  )
}
