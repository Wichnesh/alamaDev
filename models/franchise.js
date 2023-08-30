const mongoose = require("mongoose");

const franchiseSchema = new mongoose.Schema({
  franchiseID: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  registerDate: {
    type: String,
    required: true,
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
