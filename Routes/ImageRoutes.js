import express from "express";
import sharp from "sharp";
import ImageQueries from "../queries/imageQueries.js";

class ImageRoutes {
  constructor() {
    this.router = express.Router();
    this.imageQueries = new ImageQueries();

    this.router.get("/log/car/:logId", this.getLogCarImage.bind(this));
    this.router.get("/log/plate/:logId", this.getLogPlateImage.bind(this));
    this.router.get("/unit/car/:unitCarId", this.getUnitCarImage.bind(this));
  }

  async getLogCarImage(req, res) {
    try {
      const logId = req.params.logId;
      const { w, h } = req.query;
      const imageData = await this.imageQueries.getCarImageForLog(logId);
      const base64Image = Buffer.from(imageData[0].vehicle_pic);

      const resizedImageBuffer = await sharp(base64Image)
        .resize(Number(w), Number(h))
        .toBuffer();
      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Content-Length", resizedImageBuffer.length);
      res.send(resizedImageBuffer);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async getLogPlateImage(req, res) {
    try {
      const logId = req.params.logId;
      const { w, h } = req.query;
      const imageData = await this.imageQueries.getPlateImageForLog(logId);
      const base64Image = Buffer.from(imageData[0].plate_pic);

      const resizedImageBuffer = await sharp(base64Image)
        .resize(Number(w), Number(h))
        .toBuffer();

      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Content-Length", resizedImageBuffer.length);
      res.send(resizedImageBuffer);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async getUnitCarImage(req, res) {
    try {
      const unitCarId = req.params.unitCarId;
      const { w, h } = req.query;
      const imageData = await this.imageQueries.getCarImageForUnitCar(
        unitCarId
      );
      const base64Image = Buffer.from(imageData[0].car_pic);

      const resizedImageBuffer = await sharp(base64Image)
        .resize(Number(w), Number(h))
        .toBuffer();

      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Content-Length", resizedImageBuffer.length);
      res.send(resizedImageBuffer);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
}
export default ImageRoutes;
