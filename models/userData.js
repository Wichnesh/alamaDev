const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
});

const Userslist = (module.exports = mongoose.model("Userslist", usersSchema));
