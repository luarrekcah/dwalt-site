const createError = require("http-errors"),
  express = require("express"),
  path = require("path"),
  logger = require("morgan"),
  cookieParser = require("cookie-parser"),
  passport = require("passport"),
  session = require("express-session"),
  os = require('os');
const app = express();

require("./auth/local")(passport);

require('./database.js');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "/public/")));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true }));
app.use(
  session({
    secret: "123",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

require("./routes")(app);

const networkInterfaces = os.networkInterfaces();

console.log(networkInterfaces);

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log(`PORTA: ${listener.address().port}`);
});

module.exports = app;
