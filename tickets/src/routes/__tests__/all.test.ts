import request from "supertest";
import { app } from "../../app";

it("should return an empty tickets array if there are no tickets", async () => {
  const response = await request(app).get("/api/tickets").send({}).expect(200);

  expect(response.body).toHaveProperty("tickets");
  expect(response.body.tickets).toHaveLength(0);
});

it("should return an array with all created tickets", async () => {
  const ticketOne = { title: "Ticket one", price: 10 };
  const ticketTwo = { title: "Ticket two", price: 20 };

  await request(app).post("/api/tickets").send(ticketOne).expect(201);
  await request(app).post("/api/tickets").send(ticketTwo).expect(201);

  const response = await request(app).get("/api/tickets").send({}).expect(200);

  expect(response.body).toHaveProperty("tickets");
  expect(response.body.tickets).toHaveLength(2);
});
