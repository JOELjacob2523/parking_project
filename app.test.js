import supertest from "supertest";
import app from "./app.js";


describe("GET /", () => {
  it("should redirect to /app", async () => {
    const response = await supertest(app).get("/");
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/app");
    });
}
);
describe("GET /app", () => {
  it("should return the index.html", async () => {
    const response = await supertest(app).get("/app");
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toBe(
      "text/html; charset=UTF-8"
    );
    expect(response.text).toBeDefined();
    });
}
);
