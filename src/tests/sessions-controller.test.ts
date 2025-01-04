import request from "supertest";
import { app } from "@/app";
import { prisma } from "@/database/prisma";
import { hash } from "bcrypt";

describe("SessionsController", () => {
  let createdUser: number = 0;

  beforeAll(async () => {
    const hashedPassword = await hash("password123", 8);

    const userCreated = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "john@example.com",
        password: hashedPassword,
      },
    });

    createdUser = userCreated.id;
  });

  afterAll(async () => {
    await prisma.user.delete({
      where: {
        id: createdUser,
      },
    });

    await prisma.$disconnect();
  });

  it("should authenticate a user and return a token", async () => {
    const response = await request(app).post("/sessions").send({
      email: "john@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.user.email).toBe("john@example.com");
    expect(response.body.user).not.toHaveProperty("password");
  });

  it("should return 401 if email does not exist", async () => {
    const response = await request(app).post("/sessions").send({
      email: "nonexistent@example.com",
      password: "password123",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Email or password incorrect");
  });

  it("should return 401 if password is incorrect", async () => {
    const response = await request(app).post("/sessions").send({
      email: "john@example.com",
      password: "wrongpassword",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Email or password incorrect");
  });

  it("should validate the request body", async () => {
    const response = await request(app).post("/sessions").send({
      email: "invalid-email",
      password: "123",
    });

    expect(response.status).toBe(400);
  });
});
