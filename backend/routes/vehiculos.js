import express from "express"
import { db } from "../config/db.js"
import { body, validationResult } from "express-validator"

const router = express.Router()

// Middleware para manejar errores de validación
const verificarValidaciones = (req, res, next) => {
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ success: false, errors: errores.array() })
  }
  next()
}

// GET: Listado de vehículos con filtros opcionales
router.get("/", async (req, res) => {
  const filtros = []
  const parametros = []

  const { marca, modelo, patente, desde, hasta } = req.query

  if (marca) {
    filtros.push("marca LIKE ?")
    parametros.push(`%${marca}%`)
  }

  if (modelo) {
    filtros.push("modelo LIKE ?")
    parametros.push(`%${modelo}%`)
  }

  if (patente) {
    filtros.push("patente LIKE ?")
    parametros.push(`%${patente}%`)
  }

  // Filtros por fecha (anio)
  if (desde) {
    filtros.push("anio >= ?")
    parametros.push(desde)
  }

  if (hasta) {
    filtros.push("anio <= ?")
    parametros.push(hasta)
  }

  let sql =
    "SELECT id, marca, modelo, patente, anio, capacidad_carga FROM vehiculos"

  if (filtros.length > 0) {
    sql += " WHERE " + filtros.join(" AND ")
  }

  sql += " ORDER BY marca, modelo"

  try {
    const [rows] = await db.execute(sql, parametros)
    res.json({ success: true, data: rows })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ success: false, message: "Error al obtener vehículos" })
  }
})

// GET: Detalle de un vehículo por ID
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id)

  try {
    const [rows] = await db.execute("SELECT * FROM vehiculos WHERE id=?", [id])

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Vehículo no encontrado" })
    }

    res.json({ success: true, data: rows[0] })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ success: false, message: "Error al obtener el vehículo" })
  }
})

// POST: Crear un vehículo con validaciones
router.post(
  "/",
  [
    body("marca")
      .notEmpty()
      .withMessage("La marca es obligatoria")
      .isLength({ max: 50 })
      .withMessage("La marca no puede superar los 50 caracteres"),
    body("modelo")
      .notEmpty()
      .withMessage("El modelo es obligatorio")
      .isLength({ max: 50 })
      .withMessage("El modelo no puede superar los 50 caracteres"),
    body("patente")
      .notEmpty()
      .withMessage("La patente es obligatoria")
      .isLength({ max: 20 })
      .withMessage("La patente no puede superar los 20 caracteres"),
    body("anio")
      .notEmpty()
      .withMessage("El año es obligatorio")
      .isISO8601()
      .withMessage("El año debe tener formato de fecha válido (YYYY-MM-DD)"),
    body("capacidad_carga")
      .isInt({ min: 0 })
      .withMessage("La capacidad de carga debe ser un número entero positivo"),
    verificarValidaciones,
  ],
  async (req, res) => {
    const { marca, modelo, patente, anio, capacidad_carga } = req.body

    try {
      const [result] = await db.execute(
        "INSERT INTO vehiculos (marca, modelo, patente, anio, capacidad_carga) VALUES (?,?,?,?,?)",
        [marca, modelo, patente, anio, capacidad_carga]
      )

      res.status(201).json({
        success: true,
        data: {
          id: result.insertId,
          marca,
          modelo,
          patente,
          anio,
          capacidad_carga,
        },
      })
    } catch (error) {
      console.error(error)
      res
        .status(500)
        .json({ success: false, message: "Error al crear vehículo" })
    }
  }
)
router.post("/", async (req, res) => {
  try {
    const { marca, modelo, patente, anio, capacidad_carga } = req.body

    await db.query(
      "INSERT INTO vehiculos (marca, modelo, patente, anio, capacidad_carga) VALUES (?, ?, ?, ?, ?)",
      [marca, modelo, patente, anio, capacidad_carga]
    )

    res.json({ message: "Vehículo registrado" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error al registrar vehículo" })
  }
})

// PUT: Modificar un vehículo por ID con validaciones
router.put(
  "/:id",
  [
    body("marca")
      .notEmpty()
      .withMessage("La marca es obligatoria")
      .isLength({ max: 50 })
      .withMessage("La marca no puede superar los 50 caracteres"),
    body("modelo")
      .notEmpty()
      .withMessage("El modelo es obligatorio")
      .isLength({ max: 50 })
      .withMessage("El modelo no puede superar los 50 caracteres"),
    body("patente")
      .notEmpty()
      .withMessage("La patente es obligatoria")
      .isLength({ max: 20 })
      .withMessage("La patente no puede superar los 20 caracteres"),
    body("anio")
      .notEmpty()
      .withMessage("El año es obligatorio")
      .isISO8601()
      .withMessage("El año debe tener formato de fecha válido (YYYY-MM-DD)"),
    body("capacidad_carga")
      .isInt({ min: 0 })
      .withMessage("La capacidad de carga debe ser un número entero positivo"),
    verificarValidaciones,
  ],
  async (req, res) => {
    const id = Number(req.params.id)
    const { marca, modelo, patente, anio, capacidad_carga } = req.body

    try {
      await db.execute(
        "UPDATE vehiculos SET marca=?, modelo=?, patente=?, anio=?, capacidad_carga=? WHERE id=?",
        [marca, modelo, patente, anio, capacidad_carga, id]
      )

      res.json({
        success: true,
        data: { id, marca, modelo, patente, anio, capacidad_carga },
      })
    } catch (error) {
      console.error(error)
      res
        .status(500)
        .json({ success: false, message: "Error al actualizar vehículo" })
    }
  }
)

// DELETE: Eliminar un vehículo por ID
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id)

  try {
    await db.execute("DELETE FROM vehiculos WHERE id=?", [id])
    res.json({ success: true, data: id })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ success: false, message: "Error al eliminar vehículo" })
  }
})

export default router
