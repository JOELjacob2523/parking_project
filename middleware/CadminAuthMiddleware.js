import JWT from "../modules/JWT.js";
class CAdminAuthMiddleware {
  static async verifyToken(req, res, next) {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      const jwt = new JWT();
      const decoded = jwt.verifyToken(token);
      if (decoded.active == false || decoded.user_role > 2) {
        throw new Error(decoded.user_role);
      }
      req.userId = decoded.user_id;
      next();
    } catch (error) {
      console.log(error.message);
      res.status(401).json({ message: error.message });
    }
  }
}

export default CAdminAuthMiddleware;
