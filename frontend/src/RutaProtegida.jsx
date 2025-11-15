import { Navigate, Outlet } from "react-router"
import { useAuth } from "./Auth.jsx"

export function RutaProtegida() {
  const { token } = useAuth()
  if (!token) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
