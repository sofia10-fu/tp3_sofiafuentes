import express from "express"
import { db } from "../config/db.js"
import {
  validarId,
  verificarValidaciones,
} from "../middlewares/validaciones.js"
import { body } from "express-validator"

const router = express.Router()

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const [usuarios] = await db.execute(
      "SELECT id, nombre, email FROM usuarios"
    )
    res.json({ success: true, usuarios })
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al obtener usuarios" })
  }
})

// Obtener usuario por id
router.get("/:id", validarId, verificarValidaciones, async (req, res) => {
  const id = Number(req.params.id)
  try {
    const [usuarios] = await db.execute(
      "SELECT id, nombre, email FROM usuarios WHERE id=?",
      [id]
    )
    if (usuarios.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado" })
    }
    res.json({ success: true, usuario: usuarios[0] })
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al obtener usuario" })
  }
})

// Crear usuario
router.post(
  "/",
  body("nombre").isLength({ min: 1, max: 100 }),
  body("email").isEmail().isLength({ max: 150 }),
  body("password").isLength({ min: 8 }),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, email, password } = req.body
    try {
      const [resultado] = await db.execute(
        "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
        [nombre, email, password]
      )
      res.status(201).json({ success: true, userId: resultado.insertId })
    } catch (error) {
      res.status(500).json({ success: false, error: "Error al crear usuario" })
    }
  }
)

// Actualizar usuario
router.put(
  "/:id",
  validarId,
  body("nombre").optional().isLength({ min: 1, max: 100 }),
  body("email").optional().isEmail().isLength({ max: 150 }),
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id)
    const { nombre, email } = req.body
    try {
      const [resultado] = await db.execute(
        "UPDATE usuarios SET nombre=IFNULL(?, nombre), email=IFNULL(?, email) WHERE id=?",
        [nombre || null, email || null, id]
      )
      if (resultado.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, error: "Usuario no encontrado" })
      }
      res.json({ success: true })
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Error al actualizar usuario" })
    }
  }
)

// Eliminar usuario
router.delete("/:id", validarId, verificarValidaciones, async (req, res) => {
  const id = Number(req.params.id)
  try {
    const [resultado] = await db.execute("DELETE FROM usuarios WHERE id=?", [
      id,
    ])
    if (resultado.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Usuario no encontrado" })
    }
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al eliminar usuario" })
  }
})

export default router
