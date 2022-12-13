const User = require("../models/userModel");
const response = require("../utils/response");

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns user details
 */
const getUerDetails = async (req, res) => {
  try {
    const userDetails = await User.findOne({ _id: req.body._id });
    if (!userDetails) {
      return response(req, res, 404, true, false, "No user profile found");
    }

    return response(
      req,
      res,
      200,
      false,
      userDetails,
      "User details retrieve successfully"
    );
  } catch (error) {
    console.log({ error });
    return response(req, res, 500, true, false, error.message);
  }
};

module.exports = {
  getUerDetails,
};
