import express, { json, urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import WebhookRoutes from "../routes/WebhookRoutes.js";
import SuperAdminRoutes from "../routes/SuperAdminRoutes.js";
import CondoAdminRoutes from "../routes/CondoAdminRoutes.js";
import UserRoutes from "../routes/UserRoutes.js";

dotenv.config();

class App {
  constructor(port) {
    this.port = port;
    this.app = express();
    this.webhookRoutes = new WebhookRoutes().router;
    this.superAdminRoutes = new SuperAdminRoutes().router;
    this.condoAdminRoutes = new CondoAdminRoutes().router;
    this.userRoutes = new UserRoutes().router;
    this.__dirname = dirname(fileURLToPath(import.meta.url));
  }

  start() {
    this.app.use(cors());
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use("/webhook", this.webhookRoutes);
    this.app.use("/superAdmin", this.superAdminRoutes);
    this.app.use("/condoAdmin", this.condoAdminRoutes);
    this.app.use("/user", this.userRoutes);

    this.app.use(
      "/app",
      express.static(path.join(this.__dirname, "parking-client/build"))
    );

    this.app.get("/", (req, res) => {
      res.redirect("/app");
    });

    this.app.get("/app*", (req, res) => {
      res.sendFile(
        path.join(this.__dirname, "parking-client/build", "index.html")
      );
    });

    this.app.listen(this.port, () => {
      console.log(`server listening at http://localhost:${this.port}`);
      console.log(`WebSite is on http://localhost:${this.port}/app`);
    });
  }
}

export default App;
