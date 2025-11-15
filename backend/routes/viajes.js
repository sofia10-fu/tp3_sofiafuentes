import express from "express"
import { db } from "../config/db.js"

const router = express.Router()

//
// GET – Listado de viajes con filtros opcionales
//
router.get("/", async (req, res) => {
  const filtros = []
  const params = []

  const { vehiculo_id, conductor_id, origen, destino, fechaDesde, fechaHasta } =
    req.query

  if (vehiculo_id) {
    filtros.push("v.vehiculo_id = ?")
    params.push(Number(vehiculo_id))
  }

  if (conductor_id) {
    filtros.push("v.conductor_id = ?")
    params.push(Number(conductor_id))
  }

  if (origen) {
    filtros.push("v.origen LIKE ?")
    params.push(`%${origen}%`)
  }

  if (destino) {
    filtros.push("v.destino LIKE ?")
    params.push(`%${destino}%`)
  }

  if (fechaDesde) {
    filtros.push("v.fecha_salida >= ?")
    params.push(fechaDesde)
  }

  if (fechaHasta) {
    filtros.push("v.fecha_llegada <= ?")
    params.push(fechaHasta)
  }

  let sql =
    "SELECT v.id, v.vehiculo_id, v.conductor_id, v.fecha_salida, v.fecha_llegada, " +
    "v.origen, v.destino, v.kilometros " +
    "FROM viajes v "

  if (filtros.length > 0) {
    sql += " WHERE " + filtros.join(" AND ")
  }

  sql += " ORDER BY v.fecha_salida DESC"

  const [rows] = await db.execute(sql, params)
  res.json({ success: true, data: rows })
})

//
// GET – Detalle de un viaje por ID
//
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id)

  const [rows] = await db.execute("SELECT * FROM viajes WHERE id = ?", [id])

  if (rows.length === 0) {
    return res
      .status(404)
      .json({ success: false, message: "Viaje no encontrado" })
  }

  res.json({ success: true, data: rows[0] })
})

//
// POST – Crear viaje
//
router.post("/", async (req, res) => {
  const {
    vehiculo_id,
    conductor_id,
    fecha_salida,
    fecha_llegada,
    origen,
    destino,
    kilometros,
  } = req.body

  const [result] = await db.execute(
    `INSERT INTO viajes 
    (vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros)
    VALUES (?,?,?,?,?,?,?)`,
    [
      vehiculo_id,
      conductor_id,
      fecha_salida,
      fecha_llegada,
      origen,
      destino,
      kilometros,
    ]
  )

  res.status(201).json({
    success: true,
    data: {
      id: result.insertId,
      vehiculo_id,
      conductor_id,
      fecha_salida,
      fecha_llegada,
      origen,
      destino,
      kilometros,
    },
  })
})

//
// PUT – Modificar viaje
//
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id)

  const {
    vehiculo_id,
    conductor_id,
    fecha_salida,
    fecha_llegada,
    origen,
    destino,
    kilometros,
  } = req.body

  await db.execute(
    `UPDATE viajes 
     SET vehiculo_id=?, conductor_id=?, fecha_salida=?, fecha_llegada=?, 
         origen=?, destino=?, kilometros=?
     WHERE id=?`,
    [
      vehiculo_id,
      conductor_id,
      fecha_salida,
      fecha_llegada,
      origen,
      destino,
      kilometros,
      id,
    ]
  )

  res.json({
    success: true,
    data: {
      id,
      vehiculo_id,
      conductor_id,
      fecha_salida,
      fecha_llegada,
      origen,
      destino,
      kilometros,
    },
  })
})

//
// DELETE – Eliminar viaje
//
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id)

  await db.execute("DELETE FROM viajes WHERE id = ?", [id])

  res.json({ success: true, data: id })
})

export default router
