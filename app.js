import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import WebhookRoutes from "./routes/WebhookRoutes.js";
import SuperAdminRoutes from "./routes/SuperAdminRoutes.js";
import CondoAdminRoutes from "./routes/CondoAdminRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import ImageRoutes from "./routes/ImageRoutes.js";
import ValidatorRoutes from "./routes/ValidatorRoutes.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import AppAuthMiddleware from "./middleware/AppAuthMiddleware.js";

dotenv.config();

class App {
  constructor(port) {
    this.port = port;
    this.app = express();
    this.webhookRoutes = new WebhookRoutes().router;
    this.superAdminRoutes = new SuperAdminRoutes().router;
    this.validatorRoutes = new ValidatorRoutes().router; //? This is Active
    this.imageRoutes = new ImageRoutes().router; //? This is Active
    this.authRoutes = new AuthRoutes().router; //? This is Active
    this.condoAdminRoutes = new CondoAdminRoutes(this.app).router; //? This is Active
    this.userRoutes = new UserRoutes().router;
    this.__dirname = dirname(fileURLToPath(import.meta.url));
  }

  start() {
    this.app.use(
      cors({
        exposedHeaders: ["token"],
        origin: 'http://localhost:3000',
        credentials: true,
      })
    );
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use(cookieParser());

    // API Routes
    this.app.use("/api/auth", this.authRoutes);
    this.app.use("/api/webhook", this.webhookRoutes);
    this.app.use("/api/superAdmin", this.superAdminRoutes);
    this.app.use("/api/condoAdmin", this.condoAdminRoutes);
    this.app.use("/api/validate", this.validatorRoutes);
    this.app.use("/api/image", this.imageRoutes);
    this.app.use("/api/user", this.userRoutes);

    // Reroute to React App
    this.app.get("/", AppAuthMiddleware.handleHomeRoute);

    // Serve Static Files
    this.app.use(
      "/",
      express.static(path.join(this.__dirname, "parking-client/build"))
    );


    // Serve React App
    this.app.get("/*", (req, res) => {
      res.sendFile(
        path.join(this.__dirname, "parking-client/build", "index.html")
      );
    });

    this.app.listen(this.port, () => {
      console.log(`server listening at http://localhost:${this.port}/api`);
      console.log(`WebSite is on http://localhost:${this.port}`);
    });
  }
}

export default App;
