import { Outlet, Link } from "react-router"
import { useAuth } from "./Auth"
import { Ingresar } from "./Ingresar"

export const Layout = () => {
  const { email, logout } = useAuth()

  return (
    <main className="container">
      <nav>
        <ul>
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/usuarios">Usuarios</Link>
          </li>
          <li>
            <Link to="/conductores">Conductores</Link>
          </li>
          <li>
            <Link to="/vehiculos">Vehículos</Link>
          </li>
          <li>
            <Link to="/viajes">Viajes</Link>
          </li>
        </ul>
        <li>
          {email ? (
            <button onClick={() => logout()}>Salir</button>
          ) : (
            <Ingresar />
          )}
        </li>
      </nav>
      <Outlet />
    </main>
  )
}
