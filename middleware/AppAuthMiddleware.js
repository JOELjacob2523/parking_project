import JWT from "../modules/JWT.js";

class AppAuthMiddleware {
  static async handleHomeRoute(req, res, next) {

    try {
      const token = req.cookies.token;

      const jwt = new JWT();
      const decoded = jwt.verifyToken(token);
      switch (decoded.user_role) {
        case 1:
          return res.redirect("/superAdmin");
        case 2:
          return res.redirect("/admin");
        case 3:
          return res.redirect("/driver");
        case 4:
          return res.redirect("/resident");
        default:
          return res.redirect("/logIn");
      }
    } catch (error) {
      console.log(error.message, "error.message");
      return res.redirect("/logIn");
    }
  }
}

export default AppAuthMiddleware;
