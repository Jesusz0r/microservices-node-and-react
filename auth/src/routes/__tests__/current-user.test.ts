import request from "supertest";
import { app } from "../../app";

it("should return 200 and current user when there is an user authenticated", async () => {
  const email = "test@test.com";
  const signupResponse = await request(app)
    .post("/api/users/signup")
    .send({
      email,
      password: "password",
    })
    .expect(201);

  const id = signupResponse.body.user.id;
  const response = await request(app)
    .get("/api/users/current")
    .set({ Cookie: signupResponse.get("Set-Cookie") })
    .expect(200);

  expect(response.body).toHaveProperty("user");
  expect(response.body.user).toHaveProperty("email");
  expect(response.body.user.email).toBe(email);
  expect(response.body.user).toHaveProperty("id");
  expect(response.body.user.id).toBe(id);
});

it("should return 401 when there is not an user authenticated", async () => {
  await request(app).get("/api/users/current").expect(401);
});
