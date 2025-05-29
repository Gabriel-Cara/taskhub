import request from "supertest";
import { app } from "@/app";
import { prisma } from "@/database/prisma";

describe("SessionsController", () => {

  let user_id: string;

  afterAll(async () => {
    await prisma.user.delete({ where: { id: user_id } });
  })

  it("should create a new session successfully", async () => {
    const userResponse = await request(app).post("/users").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
    });

    const sessionResponse = await request(app).post("/sessions").send({
      email: "testuser@example.com",
      password: "password123",
    })

    expect(sessionResponse.status).toBe(200);
    expect(sessionResponse.body.token).toEqual(expect.any(String));

    user_id = userResponse.body.id;
  });
});