const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    const secret = process.env.JWT_SECRET;
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .send({ success: false, message: "Authorization Failed" });
      } else {
        req.body.userId = decoded.id;
        next();
      }
    });
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Authorization Failed",
    });
  }
};

module.exports = {
    authMiddleware
}