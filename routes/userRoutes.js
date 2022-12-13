const router = require("express").Router();
const { getUerDetails } = require("../controllers/userControllers");

/**
 * @GET
 */
router.get("/:user_id", getUerDetails);

/**
 * @POST
 */

module.exports = router;
