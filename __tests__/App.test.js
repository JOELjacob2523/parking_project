import request from "supertest";
import App from "../app.js";

const app = new App(3000).start();

describe("App", () => {
  describe("GET /", () => {
    it("should redirect to /app", async () => {
      const res = await request(app).get("/");
      expect(res.statusCode).toEqual(302);
      expect(res.headers.location).toEqual("/app");
    });
  });

  describe("GET /app*", () => {
    it("should serve the index.html file", async () => {
      const res = await request(app).get("/app");
      expect(res.statusCode).toEqual(200);
      expect(res.headers["content-type"]).toEqual("text/html; charset=UTF-8");
    });
  });
});