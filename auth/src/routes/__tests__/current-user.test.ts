import request from "supertest";
import { app } from "../../app";

it("should return 200 and current user when there is a user authenticated", async () => {
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

it("should return 401 and an error when there is not user authenticated", async () => {
  const response = await request(app).get("/api/users/current").expect(401);

  expect(response.body).toHaveProperty("errors");
  expect(response.body.errors[0]).toHaveProperty("message");
  expect(response.body.errors[0].message).toBe("User is invalid.");
});
