const express = require("express");
const router = express.Router();
const isAuthenticated = require("../../helpers/auth");
const multer = require("multer");
const path = require("path");
const monogose = require("mongoose");
require("../../models/Post");
const Post = monogose.model("posts");

// Create Storage Engine With Multer
const storage = multer.diskStorage({
  destination: "./public/images/posts",
  filename: (req, file, callback) => {
    callback(
      null,
      file.fieldname + "_" + Date.now() + "_" + path.extname(file.originalname)
    );
  }
});

// Init Upload Task
const upload = multer({
  storage,
  limits: { fieldSize: 1000000 },
  fileFilter: function (req, file, callback) {
    const fileTypes = /jpg|jpeg|png|gif/;
    const fileType = fileTypes.test(
      path
        .extname(file.originalname)
        .split(".")[1]
        .toLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);
    if (fileType && mimeType) {
      return callback(null, true);
    } else {
      return callback("Only Images Is Allowed To Be Uploaded");
    }
  }
}).single("image");

router.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("admin/dashboard", {
    homePage: false,
    dashboard: true,
    isHomePage: false,
    title: "Admin Dashboard"
  });
});

router.get("/users", isAuthenticated, (req, res) => {
  res.render("admin/users/index", {
    homePage: false,
    dashboard: true,
    isHomePage: false,
    title: "Users"
  });
});

router.get("/posts", isAuthenticated, (req, res) => {
  Post.find()
    .sort({ created_at: -1 })
    .then(posts => {
      res.render("admin/posts/index", {
        homePage: false,
        dashboard: true,
        isHomePage: false,
        title: "Posts",
        posts
      });
      console.log(posts);
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/posts/add", isAuthenticated, (req, res) => {
  res.render("admin/posts/add", {
    homePage: false,
    dashboard: true,
    isHomePage: false,
    title: "Add Post"
  });
});

router.post("/posts/add", upload, isAuthenticated, (req, res) => {
  const { title, details } = req.body;
  const errors = [];

  // Validate Title
  if (!title) {
    errors.push({
      error: "Title is required"
    });
  } else {
    if (title.length < 4) {
      errors.push({
        error: "Error must be at least 4 characters"
      });
    }
  }

  // Check For Errors
  if (errors.length > 0) {
    // Rerender The Form With The Errors
    res.render("admin/posts/add", {
      errors,
      titleField: title,
      homePage: false,
      details
    });
  } else {
    upload(req, res, function (err) {
      if (err) {
        res.render("admin/posts/add", {
          errors,
          titleField: title,
          details,
          errMsg: err,
          homePage: false
        });
      } else {
        new Post({
          title,
          details,
          image: req.file.filename,
          user: req.user.id
        })
          .save()
          .then(() => {
            req.flash("success_msg", "Post Addedd");
            res.redirect("/admin/posts");
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  }
});

router.get("/comments", isAuthenticated, (req, res) => {
  res.render("admin/comments/index", {
    homePage: false,
    dashboard: true,
    isHomePage: false,
    title: "Comments"
  });
});

router.get("/settings", isAuthenticated, (req, res) => {
  res.render("admin/settings/index", {
    homePage: false,
    dashboard: true,
    isHomePage: false,
    title: "Settings"
  });
});

module.exports = router;
