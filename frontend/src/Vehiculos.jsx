import { useEffect, useState } from "react"
import { useAuth } from "./Auth"

export const Vehiculos = () => {
  const { fetchAuth } = useAuth()
  const [vehiculos, setVehiculos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editVehiculo, setEditVehiculo] = useState(null)
  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    patente: "",
    ano: "",
    capacidad_carga: "",
  })

  const fetchVehiculos = async () => {
    setLoading(true)
    try {
      const response = await fetchAuth("http://localhost:3000/vehiculos")
      const data = await response.json()
      if (!response.ok)
        throw new Error(data.message || "Error al obtener vehículos")
      setVehiculos(data.data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehiculos()
  }, [])

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAdd = () => {
    setForm({
      marca: "",
      modelo: "",
      patente: "",
      ano: "",
      capacidad_carga: "",
    })
    setEditVehiculo(null)
    setShowForm(true)
  }

  const handleEdit = (v) => {
    setForm({
      marca: v.marca,
      modelo: v.modelo,
      patente: v.patente,
      ano: v.ano,
      capacidad_carga: v.capacidad_carga,
    })
    setEditVehiculo(v)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas borrar este vehículo?")) return
    const response = await fetchAuth(`http://localhost:3000/vehiculos/${id}`, {
      method: "DELETE",
    })
    if (response.ok) fetchVehiculos()
    else alert("Error al borrar vehículo")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editVehiculo) {
      const response = await fetchAuth(
        `http://localhost:3000/vehiculos/${editVehiculo.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      )
      if (response.ok) {
        setShowForm(false)
        fetchVehiculos()
      } else {
        alert("Error al editar vehículo")
      }
    } else {
      const response = await fetchAuth("http://localhost:3000/vehiculos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (response.ok) {
        setShowForm(false)
        fetchVehiculos()
      } else {
        alert("Error al agregar vehículo")
      }
    }
  }

  return (
    <>
      <h1>Vehículos</h1>
      <button onClick={handleAdd}>Agregar vehículo</button>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Patente</th>
              <th>Año</th>
              <th>Capacidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vehiculos.map((v) => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.marca}</td>
                <td>{v.modelo}</td>
                <td>{v.patente}</td>
                <td>{v.ano}</td>
                <td>{v.capacidad_carga}</td>
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
            <h2>{editVehiculo ? "Editar vehículo" : "Agregar vehículo"}</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Marca:
                <input
                  name="marca"
                  value={form.marca}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                />
              </label>
              <label>
                Modelo:
                <input
                  name="modelo"
                  value={form.modelo}
                  onChange={handleInputChange}
                  required
                  maxLength={50}
                />
              </label>
              <label>
                Patente:
                <input
                  name="patente"
                  value={form.patente}
                  onChange={handleInputChange}
                  required
                  maxLength={20}
                />
              </label>
              <label>
                Año:
                <input
                  name="ano"
                  value={form.ano}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Capacidad de carga:
                <input
                  name="capacidad_carga"
                  value={form.capacidad_carga}
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
                  {editVehiculo ? "Guardar" : "Agregar"}
                </button>
              </footer>
            </form>
          </article>
        </dialog>
      )}
    </>
  )
}
