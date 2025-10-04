const request = require("supertest");
const app = require("../src/app");
const { query } = require("../src/models/queries");

beforeAll(async () => {
  await query("DELETE FROM usuarios");
});

describe("Auth", () => {
  test("POST /auth/register → 201", async () => {
    const res = await request(app).post("/auth/register").send({
      nombre: "Ana", email: "ana@test.com", password: "123456"
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  test("POST /auth/login → 200 (token)", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "ana@test.com", password: "123456"
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("POST /auth/login inválido → 401", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "ana@test.com", password: "x"
    });
    expect(res.status).toBe(401);
  });
});
