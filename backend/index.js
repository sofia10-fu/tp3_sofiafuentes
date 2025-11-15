import cors from "cors"
import express from "express"
import passport from "passport"
import { conectarDB } from "./config/db.js"
import authRouter, { authConfig } from "./routes/auth.js"
import conductoresRouter from "./routes/conductores.js"
import usuariosRouter from "./routes/usuarios.js"
import vehiculosRouter from "./routes/vehiculos.js"
import viajesRouter from "./routes/viajes.js"

conectarDB()

const app = express()
const port = 3000

// Para interpretar body como JSON
app.use(express.json())

// Habilito CORS
app.use(cors())

authConfig()
// Inicializo passport para que los middlewares funcionen
app.use(passport.initialize())
app.get("/", (req, res) => {
  // Responder con string
  res.send("Hola mundo!")
})

app.use("/auth", authRouter)
app.use("/usuarios", usuariosRouter)
app.use("/conductores", conductoresRouter)
app.use("/vehiculos", vehiculosRouter)
app.use("/viajes", viajesRouter)

app.listen(port, () => {
  console.log(`La aplicación esta funcionando en el puerto ${port}`)
})
