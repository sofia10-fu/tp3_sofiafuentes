import { useAuth } from "./Auth.jsx"
import { useNavigate } from "react-router"
import { Ingresar } from "./Ingresar"

export function App() {
  const { email } = useAuth()
  const navigate = useNavigate()

  return (
    <article>
      <h1>Gestión de viajes</h1>
      <p>Bienvenido a la aplicación de gestión de viajes.</p>
      <p>Utilice el menú para navegar por las diferentes secciones.</p>

      {!email && (
        <section style={{ marginTop: "2rem", textAlign: "center" }}>
          <h2 style={{ color: "#d7263d" }}>¡Debe ingresar para continuar!</h2>
          <p style={{ fontSize: "1.1em" }}>
            Para acceder a las funcionalidades de la aplicación, por favor
            inicie sesión con su cuenta.
          </p>
          <Ingresar />
        </section>
      )}
    </article>
  )
}
