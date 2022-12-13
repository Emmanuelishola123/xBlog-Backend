const keys = require("./config");
const app = require("express")();
const cors = require("cors");
const bodyParser = require("body-parser");
const authRouters = require("./routes/authRoutes");
const userRouters = require("./routes/userRoutes");
const response = require("./utils/response");
const connectDB = require("./services/db");

/**
 * @MiddlewaresConfig
 */
app.use(
  cors({
    origin: [keys.CLIENT_BASEURL],
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * @DBConnection
 */
connectDB();

/**
 * @Routes
 */
app.get("/", (req, res) => {
  res.send("Welcome to xBlog Server Entrance");
});

app.use("/auth", authRouters);
app.use("/user", userRouters);

app.use(function (error, req, res, next) {
  console.log(error);
  response(req, res, 500, error);
});

app.listen(keys.PORT, () =>
  console.log(`xBlog Server running on port ${keys.PORT}`)
);
