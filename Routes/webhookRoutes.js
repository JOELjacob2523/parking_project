import express from "express";
import Log from "../modules/Log.js";

class WebhookRoutes {
  constructor() {
    this.router = express.Router();
    this.router.post("/", this.webhookHandler.bind(this));
  }

  async webhookHandler(req, res) {
    try {
      const log = new Log(req.body);
      await log.handelCameraLog();
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
}

export default WebhookRoutes;
