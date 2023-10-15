import express, { json, urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import WebhookRoutes from "./routes/WebhookRoutes.js";
import SuperAdminRoutes from "./routes/SuperAdminRoutes.js";
import CondoAdminRoutes from "./routes/CondoAdminRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;
const webhookRoutes = new WebhookRoutes().router;
const superAdminRoutes = new SuperAdminRoutes().router;
const condoAdminRoutes = new CondoAdminRoutes().router;
const userRoutes = new UserRoutes().router;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use("/webhook", webhookRoutes);
app.use("/superAdmin", superAdminRoutes);
app.use("/condoAdmin", condoAdminRoutes);
app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`);
});
