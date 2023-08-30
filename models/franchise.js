const mongoose = require("mongoose");

const franchiseSchema = new mongoose.Schema({
  franchiseID: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  contactNumber: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  registerDate: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  approve: {
    type: Boolean,
    default: false,
  },
});

const Franchiselist = (module.exports = mongoose.model(
  "Franchiselist",
  franchiseSchema
));
