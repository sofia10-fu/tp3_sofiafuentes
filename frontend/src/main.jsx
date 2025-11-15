import "@picocss/pico"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Route, Routes } from "react-router"
import { App } from "./App.jsx"
import { AuthProvider } from "./Auth.jsx"
import { Conductores } from "./Conductores.jsx"
import "./index.css"
import { Layout } from "./Layout.jsx"
import { Usuarios } from "./Usuarios.jsx"
import { Vehiculos } from "./Vehiculos.jsx"
import { Viajes } from "./Viajes.jsx"
import { RutaProtegida } from "./RutaProtegida.jsx"
import { Ingresar } from "./Ingresar.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<App />} />
            <Route element={<RutaProtegida />}>
              <Route path="usuarios" element={<Usuarios />} />
              <Route path="conductores" element={<Conductores />} />
              <Route path="vehiculos" element={<Vehiculos />} />
              <Route path="viajes" element={<Viajes />} />
            </Route>
            <Route path="ingresar" element={<Ingresar />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
)
