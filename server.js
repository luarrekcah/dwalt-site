const createError = require("http-errors"),
  express = require("express"),
  path = require("path"),
  logger = require("morgan"),
  cookieParser = require("cookie-parser");
const app = express();

require('./database.js');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/public/")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require("./routes")(app);

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log(`Porta: ${listener.address().port}`);
});

module.exports = app;