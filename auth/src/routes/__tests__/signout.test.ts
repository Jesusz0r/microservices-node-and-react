import request from "supertest";
import { app } from "../../app";

it("should signout succesfily", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);

  expect(response.body).toHaveProperty("user");
  expect(response.body.user).toBeFalsy();
  expect(response.body).toHaveProperty("token");
  expect(response.body.token).toBeFalsy();

  expect(response.get("Set-Cookie")[0]).toBe(
    "session=eyJqd3QiOm51bGx9; path=/; httponly"
  );
});
