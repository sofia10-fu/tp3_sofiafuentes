import express from "express"
import { db } from "../config/db.js"
import { body, validationResult } from "express-validator"

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const [results] = await db.execute("SELECT * FROM conductores")
    res.json(results)
  } catch (err) {
    console.error("Error al obtener conductores:", err)
    res.status(500).json({ error: "Error al obtener conductores" })
  }
})

router.post(
  "/",
  [
    body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
    body("apellido").notEmpty().withMessage("El apellido es obligatorio"),
    body("dni").isInt().withMessage("El DNI debe ser numérico"),
    body("licencia").notEmpty().withMessage("La licencia es obligatoria"),
    body("licencia_vencimiento")
      .isISO8601()
      .withMessage("La fecha de vencimiento debe tener formato YYYY-MM-DD"),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() })
    }

    const { nombre, apellido, dni, licencia, licencia_vencimiento } = req.body

    try {
      const [result] = await db.execute(
        `INSERT INTO conductores (nombre, apellido, dni, licencia, licencia_vencimiento)
         VALUES (?, ?, ?, ?, ?)`,
        [nombre, apellido, dni, licencia, licencia_vencimiento]
      )
      res.json({
        mensaje: "Conductor creado correctamente",
        id: result.insertId,
      })
    } catch (err) {
      console.error("Error al crear conductor:", err)
      res.status(500).json({ error: "No se pudo crear el conductor" })
    }
  }
)

router.put(
  "/:id",
  [
    body("nombre").notEmpty(),
    body("apellido").notEmpty(),
    body("dni").isInt(),
    body("licencia").notEmpty(),
    body("licencia_vencimiento").isISO8601(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() })
    }

    const { id } = req.params
    const { nombre, apellido, dni, licencia, licencia_vencimiento } = req.body

    try {
      await db.execute(
        `UPDATE conductores SET nombre=?, apellido=?, dni=?, licencia=?, licencia_vencimiento=? WHERE id=?`,
        [nombre, apellido, dni, licencia, licencia_vencimiento, id]
      )
      res.json({ mensaje: "Conductor actualizado correctamente" })
    } catch (err) {
      console.error("Error al actualizar conductor:", err)
      res.status(500).json({ error: "No se pudo actualizar el conductor" })
    }
  }
)

router.delete("/:id", async (req, res) => {
  const { id } = req.params
  try {
    await db.execute("DELETE FROM conductores WHERE id = ?", [id])
    res.json({ mensaje: "Conductor eliminado correctamente" })
  } catch (err) {
    console.error("Error al eliminar conductor:", err)
    res.status(500).json({ error: "No se pudo borrar el conductor" })
  }
})

export default router
