const mongoose = require("mongoose");
const Scheam = mongoose.Schema;

const PostsScheam = new Scheam({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("posts", PostsScheam);
