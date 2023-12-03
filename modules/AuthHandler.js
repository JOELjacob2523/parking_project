import speakeasy from "speakeasy";
import JWT from "./JWT.js";
import PasswordManager from "./PasswordManager.js";
import AuthQueries from "../queries/authQueries.js";
import Email from "./Email.js";

class AuthHandler {
  constructor() {
    this.AuthQueries = new AuthQueries();
    this.passwordManager = new PasswordManager();
    this.email = new Email();
    this.jwt = new JWT();
  }

  async registerHandler(user, createdBy) {
    const userId = await this.AuthQueries.createNewUser(user, createdBy);
    const payload = {
      email: user.email,
      active: false,
      reset: false,
    };
    const token = this.jwt.signToken(payload, null);

    this.email.sendEmail(
      user.email,
      this.email.passSetSubject(),
      this.email.passSetBody(token)
    );

    return userId;
  }

  async setPasswordHandler(token, password) {
    try {
      const { email, reset } = this.jwt.verifyToken(token);

      const passwordIsNull = await this.AuthQueries.seeIfPasswordIsNull(email);
      console.log(passwordIsNull, "passwordIsNull");
      if (!passwordIsNull && !reset) throw new Error("password already set");
      const hashedPassword = await this.passwordManager.hashPassword(password);
      await this.AuthQueries.setPasswordInDB(email, hashedPassword);
      return;
    } catch (error) {
      throw error;
    }
  }

  async loginHandler(email, password, remember) {
    try {
      const user = await this.AuthQueries.findUserByEmail(
        email.trim().toLowerCase()
      );

      if (!user) throw new Error("user");
      if (user.password === null) throw new Error("pas not set");
      console.log(user);
      const psswordMatch = await this.passwordManager.comparePassword(
        password,
        user.password
      );

      if (!psswordMatch) throw new Error("password");
      if (!user.is_active) throw new Error("is_active");
      const payload = {
        user_id: user.user_id,
        email: user.email,
        user_role: user.user_role,
        active: user.is_active,
      };
      const token = this.jwt.signToken(payload, remember ? "7d" : "1h");
      return { token, user_role: user.user_role };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async generateOTP(email) {
    try {
      const exsits = await this.AuthQueries.seeIfEmailExists(email);
      if (!exsits) throw new Error("Cannot find email");
      const secret = speakeasy.generateSecret({ length: 20 });
      const otp = speakeasy.totp({
        secret: secret.base32,
        encoding: "base32",
      });

      await this.AuthQueries.setOTPInDB(email, otp);

      setTimeout(async () => {
        await this.AuthQueries.removeOTPFromDB(email);
      }, 5 * 60 * 1000);

      this.email.sendEmail(
        email,
        this.email.otpSubject(),
        this.email.otpBody(otp)
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async verifyOTP(email, otp) {
    const storedOTP = await this.AuthQueries.getOTPFromDB(email);
    console.log(storedOTP, "storedOTP");
    console.log(storedOTP[0], "storedOTP[0]");
    if (!storedOTP || otp !== storedOTP[0].otp) throw new Error("Invalid OTP");

    if (
      new Date(storedOTP[0].otp_created_at).getTime() <
      Date.now() - 5 * 60 * 1000
    ) {
      console.log("OTP expired");
      await this.AuthQueries.removeOTPFromDB(email);
      throw new Error("OTP expired");
    }

    await this.AuthQueries.removeOTPFromDB(email);
    const payload = {
      email,
      reset: true,
    };
    const token = this.jwt.signToken(payload);

    return token;
  }
}

export default AuthHandler;
