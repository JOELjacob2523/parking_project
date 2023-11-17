import JWT from "../modules/JWT.js";
class CAdminAuthMiddleware {
  static async verifyToken(req, res, next) {
    console.log("from verifyToken");
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      console.log(token, "token+++++++++++++++++++token");

      const jwt = new JWT();
      const decoded = jwt.verifyToken(token);
      console.log(decoded.active == false || decoded.user_role <= 2);
      console.log(decoded.user_role);
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
