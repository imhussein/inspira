const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../../models/User");
const User = mongoose.model("users");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Render Login Form
router.get("/login", (req, res) => {
  res.render("users/login", {
    homePage: false,
    title: "Login"
  });
});

// Render Register Form
router.get("/register", (req, res) => {
  res.render("users/register", {
    homePage: false,
    title: "Register"
  });
});

// Register Users
router.post("/register", (req, res) => {
  const errors = [];
  const { name, username, email, password, confirm_password } = req.body;

  // Server Side Validation

  // Validate Name
  if (!name) {
    errors.push({
      error: "Name field is required"
    });
  } else {
    if (name.length < 5) {
      errors.push({
        error: "Name must be at least 5 characters"
      });
    }
  }

  // Validate Username
  if (!username) {
    errors.push({
      error: "Username field is required"
    });
  } else {
    if (username.length < 5) {
      errors.push({
        error: "Username must be at least 5 characters"
      });
    }
  }

  // Validate Email
  if (!email) {
    errors.push({
      error: "Email field is required"
    });
  }

  // Validate Password
  if (!password) {
    errors.push({
      error: "Password field is required"
    });
  } else {
    if (password.length < 6) {
      errors.push({
        error: "Password must be at least 6 characters"
      });
    }
  }

  // Validate Confirm Password
  if (confirm_password != password) {
    errors.push({
      error: "Passwords do not match"
    });
  }

  // Check Errors
  if (errors.length) {
    // Rerender The Form With Errors And Data
    res.render("users/register", {
      errors,
      name,
      username,
      password,
      confirm_password,
      email
    });
  } else {
    // Check if user name is not exist in db
    User.findOne({
      username
    })
      .then(user => {
        if (user) {
          errors.push({
            error: "Username is already taken"
          });
          res.render("users/register", {
            errors,
            name,
            username,
            email,
            password,
            confirm_password
          });
        } else {
          // Check if email is not exist in db
          User.findOne({
            email
          })
            .then(user => {
              if (user) {
                errors.push({
                  error: "Email is already taken"
                });
                res.render("users/register", {
                  errors,
                  name,
                  username,
                  email,
                  password,
                  confirm_password
                });
              } else {
                // Encrypt User Password
                bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(password, salt, (err, hash) => {
                    if (err) throw err;
                    new User({
                      name,
                      email,
                      password: hash,
                      username
                    })
                      .save()
                      .then(() => {
                        req.flash(
                          "success_msg",
                          "You are successfuly registered"
                        );
                        res.redirect("/users/login");
                      })
                      .catch(err => {
                        console.log(err);
                      });
                  });
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
});

// Login Users
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/admin/dashboard",
    failureFlash: true,
    failureRedirect: "/users/login"
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
