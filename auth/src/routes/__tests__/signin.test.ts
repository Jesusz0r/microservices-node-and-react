import request from "supertest";
import { app } from "../../app";

it("should return 400 status when email deos not no exists", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("should return 400 status when email sent is invalid", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "testtest.com",
      password: "password",
    })
    .expect(400);
});

it("should return 400 status when password sent is invalid", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "1",
    })
    .expect(400);
});

it("should return status 200, user and jwt on body when signin is successful", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  expect(response.body).toHaveProperty("user");
  expect(response.body.user).toHaveProperty("email");
  expect(response.body.user.email).toBe("test@test.com");
  expect(response.body.user).toHaveProperty("id");
  expect(response.body).toHaveProperty("token");
  expect(typeof response.body.token).toBe("string");
});

it("should return 200 and a cookie when signup is successful", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
