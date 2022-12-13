// const Logger = require("./logger");

module.exports = async (
  req,
  res,
  status,
  error = null,
  data = null,
  message = null
) => {
  let response = {
    data: data ? data : false,
    error: error ? error : false,
  };

  switch (status) {
    case 200:
      response["message"] = message ? message : "Successful";
      // Logger.log(
      //   "info",
      //   `Success on : ${req.protocol}://${req.get("host")}${
      //     req.originalUrl
      //   } | status: ${status}`
      // );
      break;
    case 201:
      response["message"] = message ? message : "Created Successfully";
    // Logger.log(
    //   "info",
    //   `Success on : ${req.protocol}://${req.get("host")}${
    //     req.originalUrl
    //   } | status: ${status}`
    // );
      break;
    case 203:
      status = 403;
      response["error"] = true;
      response["message"] = message ? message : "An Error Occured";
      // Logger.log(
      //   "info",
      //   `Success on : ${req.protocol}://${req.get("host")}${
      //     req.originalUrl
      //   } | status: ${status}`
      // );
      break;
    case 204:
      // Logger.log(
      //   "info",
      //   `Success on : ${req.protocol}://${req.get("host")}${
      //     req.originalUrl
      //   } | status: ${status}`
      // );
      break;
    case 400:
      response["error"] = true;
      response["message"] = message ? message : "Bad Request";
      // Logger.log(
      //   "info",
      //   `Success on : ${req.protocol}://${req.get("host")}${
      //     req.originalUrl
      //   } | status: ${status}`
      // );
      break;
    case 401:
      response["error"] = true;
      response["message"] = message ? message : "Unauthorized Access";
      // Logger.log(
      //   "info",
      //   `Success on : ${req.protocol}://${req.get("host")}${
      //     req.originalUrl
      //   } | status: ${status}`
      // );
      break;
    case 403:
      response["error"] = error;
      response["message"] = message ? message : "Invalid Request Format";
      // Logger.log(
      //   "info",
      //   `Success on : ${req.protocol}://${req.get("host")}${
      //     req.originalUrl
      //   } | status: ${status}`
      // );
      break;
    case 404:
      response["error"] = true;
      response["message"] = message ? message : "Resource Not Found";
      // Logger.log(
      //   "info",
      //   `Success on : ${req.protocol}://${req.get("host")}${
      //     req.originalUrl
      //   } | status: ${status}`
      // );
      break;
    case 405:
      response["error"] = true;
      response["message"] = message ? message : "Method Not Allowed";
      // Logger.log(
      //   "info",
      //   `Success on : ${req.protocol}://${req.get("host")}${
      //     req.originalUrl
      //   } | status: ${status}`
      // );
      break;
    case 500:
      response["error"] = true;
      response["message"] = message ? message : "Internal Server Error";
      // if(process.env.NODE_ENV == "production"){
      //     await sendEmail({
      //         email: "adegboromichael@gmail.com",
      //         path: "error_mail",
      //         data: {
      //             message: `Error on : ${req.protocol}://${req.get('host')}${req.originalUrl} | status: ${status} | message: ${error.message}`,
      //             error: error
      //         },
      //         title: "Error Email"
      //     })
      // }
      // Logger.log(
      //   "error",
      //   `Error on : ${req.protocol}://${req.get("host")}${
      //     req.originalUrl
      //   } | status: ${status} | message: ${error.message}`
      // );
      break;
  }

  return res.status(status).json(response);
};
