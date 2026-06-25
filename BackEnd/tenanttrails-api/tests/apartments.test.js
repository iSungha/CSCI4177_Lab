import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../app.js";

describe("apartments API", () => {
  it("lists apartments", async () => {
    const res = await request(app).get("/api/apartments");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("blocks an unauthenticated review", async () => {
    const res = await request(app)
      .post("/api/apartments/1/reviews")
      .send({
        rating: 5,
        body: "Nice place",
      });

    expect(res.status).toBe(401);
  });
});