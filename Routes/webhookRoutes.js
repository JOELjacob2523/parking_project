import express from "express";
import WebhookUtilities from "../Utilities/WebhookUtilities.js";

class WebhookRoutes {
  constructor() {
    this.router = express.Router();
    this.WebhookUtilities = new WebhookUtilities();
    this.router.post("/", this.webhookHandler.bind(this));
  }

  async webhookHandler(req, res) {
    try {
      const log = req.body;
      await this.WebhookUtilities(log);
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
}

export default WebhookRoutes;
