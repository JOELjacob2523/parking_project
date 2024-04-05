import express from "express";
import AuthQueries from "../queries/authQueries.js";
import AuthHandler from "../modules/AuthHandler.js";

class AuthRoutes {
  constructor() {
    this.router = express.Router();
    this.AuthQueries = new AuthQueries();
    this.AuthHandler = new AuthHandler();

    this.router.post("/login", this.login.bind(this));
    this.router.post("/logout", this.logout.bind(this));
    this.router.post("/register", this.register.bind(this));
    this.router.post("/setPassword", this.setPassword.bind(this));
    this.router.get("/otp", this.getOtp.bind(this));
    this.router.post("/otp", this.handleOtpCode.bind(this));
    // this.router.post("/reset", this.reset.bind(this));
    // this.router.post("/change", this.change.bind(this));
  }

  async register(req, res) {
    const created_by = req.userId ? req.userId : 30; // TODO: remove this line
    try {
      const user = req.body;
      const result = await this.AuthHandler.registerHandler(user, created_by);
      res.json(result).status(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async setPassword(req, res) {
    try {
      const { token, pass } = req.body;
      await this.AuthHandler.setPasswordHandler(token, pass);
      res.sendStatus(200);
    } catch (error) {
      console.log(error.message);
      error.message == "Invalid token"
        ? res.sendStatus(401)
        : error.message == "password already set"
        ? res.sendStatus(400)
        : res.sendStatus(500);
    }
  }

  async login(req, res) {
    try {
      const { email, password, remember } = req.body;
      const { token, user_role } = await this.AuthHandler.loginHandler(
        email,
        password,
        remember
      );
      res.setHeader("token", token);
      res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
      res.status(200).json({ message: "success", user_role });
    } catch (err) {
      console.log(err.message, "err.message");
      if (
        err.message == "user" ||
        err.message == "password" ||
        err.message == "is_active" ||
        err.message == "pas not set"
      ) {
        return res.status(400).json({ message: err.message });
      }
      res.sendStatus(500);
    }
  }

  async logout(req, res) {
    try {
      res.clearCookie("token");
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }

  async getOtp(req, res) {
    try {
      let email = req.query.email.trim().toLowerCase();
      const otp = await this.AuthHandler.generateOTP(email);
      res.sendStatus(200);
    } catch (error) {
      if (error.message == "Cannot find email") {
        return res.status(400).json({ message: error.message });
      }
      console.log(error.message);
      res.sendStatus(500);
    }
  }

  async handleOtpCode(req, res) {
    const { email, otp } = req.body;
    try {
      const token = await this.AuthHandler.verifyOTP(email, otp);
      res.json(token).status(200);
    } catch (error) {
      console.log(error.message);
      if (error.message == "Invalid OTP" || error.message == "OTP expired") {
        return res.status(400).json({ message: error.message });
      }
      res.sendStatus(500);
    }
  }
}

export default AuthRoutes;
