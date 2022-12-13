const router = require("express").Router();
const {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authControllers");
const authenticate = require("../middlewares/authenticate");
const {
  register,
  validate,
  login,
  forget_password,
  reset_password,
} = require("../middlewares/validator");

/**
 * @POST
 */
router.post("/register", validate(register), registerUser);
router.post("/login", validate(login), loginUser);
router.post("/forget-password", validate(forget_password), forgotPassword);
router.post("/reset-password", validate(reset_password), resetPassword);

module.exports = router;
