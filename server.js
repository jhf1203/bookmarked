// eslint-disable-next-line no-unused-vars
const dotenv = require("dotenv").config();
const express = require("express");
// eslint-disable-next-line no-unused-vars
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const passport = require("passport");
const moment = require("moment");
const helmet = require("helmet");
const PORT = process.env.PORT || 3334;
const app = express();
const db = require("./models");
const upload = require("./controllers/upload");
const cloudinary = require("cloudinary").v2;
const mysql = require("mysql");
let connection;

if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
  connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "project2_dev"
  });
}

// app.use(express.cookieParser('benny'));
app.use(require("express-session")({ secret: "benny", resave: true, saveUninitialized: true }));

console.log(process.env);

const helpers = require("./utils/helper");
const exphbs = require("express-handlebars");
const hbs = exphbs.create({ helpers });

// app.use(express.cookieParser("benny"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");

if (app.get("env") !== "test") {
  app.use(morgan("dev")); // Hook up the HTTP logger
}

app.use(express.static("public"));


require("./config/passport")(db, app, passport); // pass passport for configuration

// Define our routes
app.use("/api", require("./routes/apiRoutes")(passport, db));
app.use(require("./routes/htmlRoutes")(db));

// Secure express app
app.use(helmet.hsts({
  maxAge: moment.duration(1, "years").asMilliseconds()
}));

// for cloudinary
app.post("/image", upload.single("image"), (req, res) => { res.send(req.file); });

app.post("/image", upload.single("image"), async (req, res) => {
  const result = await cloudinary.v2.uploader.upload(req.file.path);
  res.send(result);
});

app.get("/api/image", async (req, res) => {
  const images = await cloudinary.v2.api.resources({
    type: "upload",
    prefix: "image"
  });
  return res.json(images);
});

// app.get("/image", async (req, res) => {
//   const images = await cloudinary.v2.api.resources({
//     type: "upload",
//     prefix: "image"
//   });
//   // Check if files
//   if (!images || images.length === 0) {
//     return res.status(404).json({
//       err: "No files exist"
//     });
//   }
//   // Files exist
//   res.render("files", {
//     images: images
//   });
// });

// catch 404 and forward to error handler
if (app.get("env") !== "development") {
  app.use((req, res, next) => {
    const err = new Error("Not Found: " + req.url);
    err.status = 404;
    next(err);
  });
}

const syncOptions = {
  force: process.env.FORCE_SYNC === "true"
};

if (app.get("env") === "test") {
  syncOptions.force = true;
}

db.sequelize.sync(syncOptions).then(() => {
  if (app.get("env") !== "test" && syncOptions.force) {
    require("./db/seed")(db);
  }

  app.listen(PORT, () => {
    console.log(`App listening on port: ${PORT}`);
  });
});

connection.connect();
module.exports = app;
