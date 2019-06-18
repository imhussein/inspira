const express = require("express");
const app = express();
const { prod_port, db_uri } = require("./config/config");
const mongoose = require("mongoose");
const path = require("path");
const exhbs = require("express-handlebars");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

// Connect To DB
mongoose
  .connect(db_uri, { useNewUrlParser: true })
  .then(() => {
    console.log(`Connected To DB`);
  })
  .catch(err => {
    console.log(err);
  });

require("./config/passport")(passport);

// Express Session Middleware
app.use(
  session({
    resave: true,
    secret: "secret",
    saveUninitialized: true
  })
);
app.use(flash());

// Passport Middlewares
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.brand = "Inspira";
  res.locals.error_msg = req.flash("error_msg");
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user;
  next();
});

// Middlewares
app.use("/assets", express.static(path.join(__dirname, "public")));

app.set("view engine", "handlebars");
app.engine("handlebars", exhbs({ defaultLayout: "main" }));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const users = require("./routes/users/users");
const admin = require("./routes/admin/admin");
app.use("/users", users);
app.use("/admin", admin);
// Listen To Port 3000
const port = process.env.PORT || prod_port;
app.listen(port, () => {
  console.log(`App started at port ${port}`);
});
