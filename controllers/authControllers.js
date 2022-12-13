const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { signJWT } = require("../utils/jwt");
const response = require("../utils/response");
const { encrypt } = require("../utils/encryption");
const keys = require("../config");
const { generateId, extendPeriod } = require("../utils");

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns jwt-signed-token + user details
 */
const registerUser = async (req, res) => {
  try {
    // Check if user exist
    const userExist = await User.findOne({ email: req.body.email });

    if (userExist) {
      return response(req, res, 403, true, false, "User already exist!");
    }

    // Hashed user password
    const salt = bcrypt.genSaltSync(Number(keys.SALT_ROUNDS));
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    // Create new user in DB
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    console.log({newUser});

    // Generate JWT payload for token signing
    const jwt_payload = {
      _id: encrypt(newUser?._id?.toString()),
      name: encrypt(newUser?.name?.toString()),
      username: encrypt(newUser?.username?.toString()),
      email: encrypt(newUser?.email?.toString()),
    };

    // Generate JWT token
    const token = await signJWT(jwt_payload);

    newUser._doc.token = token;
    delete newUser._doc.__v;
    delete newUser._doc.password;

    return response(req, res, 201, false, newUser, "Registered Successfully!");
  } catch (error) {
    console.log({ error });
    return response(req, res, 500, true, false, error.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns jwt-signed-token + user details
 */
const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    // Check if user exist
    if (!user) {
      return response(req, res, 404, true, false, "User not found!");
    }
    // Compare plaintext password && hashed password from DB
    const match = await bcrypt.compare(req.body.password, user.password);

    console.log({match})
    if (!match) {
      return response(req, res, 404, true, false, "Incorrect Credentials");
    }

    // Generate JWT payload for token signing
    const jwt_payload = {
      _id: encrypt(user?._id?.toString()),
      name: encrypt(user?.name?.toString()),
      username: encrypt(user?.username?.toString()),
      email: encrypt(user?.email?.toString()),
    };

    // Generate JWT token
    const token = await signJWT(jwt_payload);

    user._doc.token = token;
    delete user._doc.__v;
    delete user._doc.password;

    return response(req, res, 200, false, user, "Login Successfully");
  } catch (error) {
    console.log({ error });
    return response(req, res, 500, true, false, error.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns Password Reset Link
 */
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user)
      return response(
        req,
        res,
        404,
        true,
        false,
        "No account related to this email address was found!"
      );

    const resetToken = generateId();

    let updateUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          reset_token: resetToken,
          reset_token_ttl: extendPeriod(12),
        },
      },
      {
        new: true,
      }
    );

    const link = `${keys.CLIENT_BASEURL}/auth/reset-password/${resetToken}`;

    // await sendMail({
    //   from: "noreply@getspire.io",
    //   fromName: "Spirē Technologies",
    //   to: email,
    //   subject: "Reset Password",
    //   templateID: 3748889,
    //   resetLink: link,
    // });

    response(
      req,
      res,
      200,
      false,
      [link, updateUser],
      `Recovery link has been sent to ${req.body.email}`
    );
  } catch (error) {
    console.log({ error });
    return response(req, res, 500, true, false, error.message);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns null
 */
const resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({ reset_token: req.body.token });

    if (!user)
      return response(
        req,
        res,
        404,
        true,
        false,
        "Invalid password reset link"
      );

    const newResetToken = generateId();
    const currentTime = new Date(Date.now());

    if (currentTime.getTime() > user.reset_token_ttl.getTime()) {
      const token = await User.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            reset_token: newResetToken,
            reset_token_ttl: extendPeriod(12),
          },
        },
        {
          new: true,
        }
      );

      const link = `${keys.CLIENT_BASEURL}/auth/reset-password/${token.reset_token}`;

      // await sendMail({
      //   from: "noreply@getspire.io",
      //   fromName: "Spirē Technologies",
      //   to: email,
      //   subject: "Reset Password",
      //   templateID: 3748889,
      //   resetLink: link,
      // });

      return response(
        req,
        res,
        403,
        true,
        false,
        `Token expired. A new password reset link has been sent to ${user.email}🤺`
      );
    }

    // Hashed user password
    const salt = bcrypt.genSaltSync(Number(keys.SALT_ROUNDS));
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          reset_token: "",
          reset_token_ttl: extendPeriod(12),
        },
      },
      {
        new: true,
      }
    );

    response(
      req,
      res,
      200,
      false,
      {},
      `Password reset for ${user.email} successful.`
    );
  } catch (error) {
    console.log(error);
    return response(req, res, 500, true, false, error.message);
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
