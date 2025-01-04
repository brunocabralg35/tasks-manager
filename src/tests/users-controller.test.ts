import request from "supertest";
import { app } from "@/app";
import { prisma } from "@/database/prisma";

describe("UsersController", () => {
  let createdUser: number = 0;

  afterAll(async () => {
    await prisma.user.delete({
      where: {
        id: createdUser,
      },
    });

    await prisma.$disconnect();
  });

  it("should create a new user successfully", async () => {
    const response = await request(app).post("/users").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("John Doe");
    expect(response.body.email).toBe("john@example.com");
    expect(response.body).not.toHaveProperty("password");

    createdUser = response.body.id;
  });

  it("should not allow creating a user with an existing email", async () => {
    const response = await request(app).post("/users").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("E-mail already registered");
  });

  it("should validate the request body", async () => {
    const response = await request(app).post("/users").send({
      name: "Jo",
      email: "invalid-email",
      password: "123",
    });

    expect(response.status).toBe(400);
  });
});
