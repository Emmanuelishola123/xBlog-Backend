const jwt = require("jsonwebtoken");
const keys = require("../config");

const signJWT = async (payload) => {
  return jwt.sign(payload, keys.JWT_TOKEN);
};

const verifyJWT = async (token) => {
  return jwt.verify(token, keys.JWT_TOKEN, (err, decoded) => {
    if (!err) {
      let user = decoded;
      if (user && user._id) {
        user._id = decrypt(user._id);
        user.email = decrypt(user.email);
        user.name = decrypt(user.name);
        user.username = decrypt(user.username);

        req.body["user"] = user;
        next();
      } else {
        response(req, res, 401);
      }
    } else {
      response(req, res, 401);
    }
  });
};

module.exports = { signJWT, verifyJWT };
