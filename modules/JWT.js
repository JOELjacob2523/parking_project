import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

class JWT {
  constructor() {
    this.secret = process.env.PRIVATE_KEY;
    this.public = process.env.PUBLIC_KEY;
  }


  signToken(payload, expiresIn = "1h") {
    const options = { algorithm: "RS256" };
    if (expiresIn !== null) {
      options.expiresIn = expiresIn;
    }
    return jwt.sign(payload, this.secret, options);
  }

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.public);
      return decoded;
    } catch (err) {
      console.log(err);
      throw new Error("Invalid token");
    }
  }
}

export default JWT;
