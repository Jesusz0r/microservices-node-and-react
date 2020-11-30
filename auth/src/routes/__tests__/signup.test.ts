import request from "supertest";
import { app } from "../../app";

it("should return 201 when right email and password are provided to signup", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("should return 400 when email sent is invalid", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "testtest.com",
      password: "password",
    })
    .expect(400);
});

it("should return 400 when password sent is invalid", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "1",
    })
    .expect(400);
});

it("should return 400 when email is missing", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      password: "password",
    })
    .expect(400);
});

it("should return 400 when password is missing", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
    })
    .expect(400);
});

it("should return 400 when passing duplicate email", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("should return user and jwt on body when signup is successful", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  expect(response.body).toHaveProperty("user");
  expect(response.body.user).toHaveProperty("email");
  expect(response.body.user.email).toBe("test@test.com");
  expect(response.body.user).toHaveProperty("id");
  expect(response.body).toHaveProperty("token");
  expect(typeof response.body.token).toBe("string");
});

it("should return a cookie when signup is successful", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
