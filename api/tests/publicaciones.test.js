const request = require("supertest");
const app = require("../src/app");
const { query } = require("../src/models/queries");

let token;
let categoriaId;

beforeAll(async () => {
  // Limpia y reinicia los ID para que todo sea determinista
  await query("TRUNCATE TABLE publicaciones RESTART IDENTITY CASCADE");
  await query("TRUNCATE TABLE usuarios RESTART IDENTITY CASCADE");
  await query("TRUNCATE TABLE categorias RESTART IDENTITY CASCADE");

  // Crea una categoría y guarda su ID real
  const cat = await query(
    "INSERT INTO categorias (nombre) VALUES ($1) RETURNING id",
    ["Perros"]
  );
  categoriaId = cat.rows[0].id;

  // Usuario + login para obtener token
  await request(app).post("/auth/register").send({
    nombre: "Ana", email: "ana@test.com", password: "123456"
  });
  const login = await request(app).post("/auth/login").send({
    email: "ana@test.com", password: "123456"
  });
  token = login.body.token;
});

test("GET /publicaciones → 200", async () => {
  const res = await request(app).get("/publicaciones");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test("POST /publicaciones sin token → 401", async () => {
  const res = await request(app).post("/publicaciones").send({
    categoria_id: categoriaId,      // ← usa el ID real
    titulo: "Collar",
    descripcion: "",
    precio: 5000
  });
  expect(res.status).toBe(401);
});

test("POST /publicaciones con token → 201", async () => {
  const res = await request(app)
    .post("/publicaciones")
    .set("Authorization", `Bearer ${token}`)
    .send({
      categoria_id: categoriaId,     // ← usa el ID real
      titulo: "Collar",
      descripcion: "",
      precio: 5000
    });
  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty("id");
});
