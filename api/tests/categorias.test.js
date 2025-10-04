const request = require("supertest");
const app = require("../src/app");
const { query } = require("../src/models/queries");

beforeAll(async () => {
  await query("DELETE FROM categorias");
  await query("INSERT INTO categorias (nombre) VALUES ('Perros'),('Gatos'),('Accesorios')");
});

test("GET /categorias → 200 y arreglo", async () => {
  const res = await request(app).get("/categorias");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBeGreaterThan(0);
});
