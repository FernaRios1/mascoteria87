const router = require("express").Router();
const Joi = require("joi");
const { query } = require("../models/queries");
const auth = require("../middlewares/auth");

// Soporte de imágenes
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");

// === carpeta uploads absoluta (api/uploads) ===
const uploadsPath = path.resolve(__dirname, "..", "..", "uploads");
fs.mkdirSync(uploadsPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsPath),
  filename: (_req, file, cb) =>
    cb(null, `${uuid()}${path.extname(file.originalname).toLowerCase()}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ---------- helpers ----------
function pickCategoriaId(body) {
  // Acepta: categoria_id, categorias (string/array), categorias[]
  if (body.categoria_id !== undefined) {
    const v = Array.isArray(body.categoria_id) ? body.categoria_id[0] : body.categoria_id;
    return Number(v);
  }
  if (body.categorias !== undefined) {
    const v = Array.isArray(body.categorias) ? body.categorias[0] : body.categorias;
    return Number(v);
  }
  if (body["categorias[]"] !== undefined) {
    const v = Array.isArray(body["categorias[]"]) ? body["categorias[]"][0] : body["categorias[]"];
    return Number(v);
  }
  return undefined;
}

function toNumberOrNull(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

// ================= LISTADO (con filtros/paginación) =================
router.get("/", async (req, res, next) => {
  try {
    const { categoria_id, page, limit } = req.query;

    const where = [];
    const params = [];
    if (categoria_id) {
      params.push(Number(categoria_id));
      where.push(`p.categoria_id = $${params.length}`);
    }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const pageNum = page ? Math.max(1, Number(page)) : null;
    const limitNum = limit ? Math.max(1, Number(limit)) : null;

    if (pageNum && limitNum) {
      const { rows: countRows } = await query(
        `SELECT COUNT(*)::int AS total FROM publicaciones p ${whereSql}`,
        params
      );
      const total = countRows[0]?.total ?? 0;
      const pages = Math.max(1, Math.ceil(total / limitNum));
      const offset = (pageNum - 1) * limitNum;

      const { rows: items } = await query(
        `SELECT p.*, c.nombre AS categoria
         FROM publicaciones p
         LEFT JOIN categorias c ON c.id = p.categoria_id
         ${whereSql}
         ORDER BY p.creado_en DESC
         LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        [...params, limitNum, offset]
      );
      return res.json({ items, total, page: pageNum, pages });
    }

    const { rows } = await query(
      `SELECT p.*, c.nombre AS categoria
       FROM publicaciones p
       LEFT JOIN categorias c ON c.id = p.categoria_id
       ${whereSql}
       ORDER BY p.creado_en DESC`,
      params
    );
    res.json(rows);
  } catch (e) { next(e); }
});

// ================= DETALLE =================
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "ID inválido" });

    const { rows } = await query(
      `SELECT p.*, c.nombre AS categoria
       FROM publicaciones p
       LEFT JOIN categorias c ON c.id = p.categoria_id
       WHERE p.id = $1`,
      [id]
    );

    if (!rows[0]) return res.status(404).json({ error: "Publicación no encontrada" });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

// ================= CREAR =================
const createSchema = Joi.object({
  categoria_id: Joi.number().integer().required(),
  titulo: Joi.string().min(3).required(),
  descripcion: Joi.string().allow(""),
  precio: Joi.number().min(0).required(),
  imagen_url: Joi.string().uri().allow(null, "")
});

router.post("/", auth, upload.single("imagen"), async (req, res, next) => {
  try {
    // Normalizar body desde form-data
    const body = { ...req.body };
    const categoria_id = pickCategoriaId(body);
    const precio = toNumberOrNull(body.precio);
    const titulo = (body.titulo || "").toString().trim();
    const descripcion = (body.descripcion || "").toString();

    const validar = {
      categoria_id,
      titulo,
      descripcion,
      precio,
      imagen_url: body.imagen_url ?? null,
    };
    const { error } = createSchema.validate(validar, { abortEarly: false });
    if (error) return res.status(400).json({ error: "Validación", detalles: error.details });

    const imagenSubida = req.file ? `/uploads/${req.file.filename}` : null;
    const imagen = imagenSubida || body.imagen_url || null;

    const { rows } = await query(
      `INSERT INTO publicaciones (usuario_id, categoria_id, titulo, descripcion, precio, imagen_url)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [req.user.id, categoria_id, titulo, descripcion, precio, imagen]
    );

    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

// ================= EDITAR (PATCH) =================
const updateSchema = Joi.object({
  categoria_id: Joi.number().integer(),
  titulo: Joi.string().min(3),
  descripcion: Joi.string().allow(""),
  precio: Joi.number().min(0),
  imagen_url: Joi.string().uri().allow(null, "")
}).min(1);

router.patch("/:id", auth, upload.single("imagen"), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "ID inválido" });

    const dueño = await query("SELECT usuario_id FROM publicaciones WHERE id=$1", [id]);
    if (!dueño.rows[0]) return res.status(404).json({ error: "Publicación no encontrada" });
    if (dueño.rows[0].usuario_id !== req.user.id) return res.status(403).json({ error: "No autorizado" });

    const body = { ...req.body };
    const maybeCategoria = pickCategoriaId(body);
    const maybePrecio = body.precio !== undefined ? toNumberOrNull(body.precio) : undefined;

    const imagenSubida = req.file ? `/uploads/${req.file.filename}` : undefined;
    const imagen = imagenSubida ?? body.imagen_url;

    const updates = {
      categoria_id: maybeCategoria,
      titulo: body.titulo,
      descripcion: body.descripcion,
      precio: maybePrecio,
      imagen_url: imagen
    };

    // Validar solo lo enviado
    const validar = {};
    for (const [k, v] of Object.entries(updates)) {
      if (v !== undefined) validar[k] = v;
    }
    const { error } = updateSchema.validate(validar, { abortEarly: false });
    if (error) return res.status(400).json({ error: "Validación", detalles: error.details });

    const fields = [];
    const vals = [];
    let i = 1;
    for (const [k, v] of Object.entries(updates)) {
      if (v !== undefined) { fields.push(`${k}=$${i++}`); vals.push(v); }
    }
    if (!fields.length) return res.status(400).json({ error: "Sin cambios" });
    vals.push(id);

    const { rows } = await query(
      `UPDATE publicaciones SET ${fields.join(", ")} WHERE id=$${i} RETURNING *`,
      vals
    );
    res.json(rows[0]);
  } catch (e) { next(e); }
});

// ================= ELIMINAR =================
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "ID inválido" });

    const pub = await query("SELECT usuario_id FROM publicaciones WHERE id=$1", [id]);
    if (!pub.rows[0]) return res.status(404).json({ error: "Publicación no encontrada" });
    if (pub.rows[0].usuario_id !== req.user.id) return res.status(403).json({ error: "No autorizado" });

    await query("DELETE FROM publicaciones WHERE id=$1", [id]);
    res.status(204).send();
  } catch (e) { next(e); }
});

module.exports = router;
