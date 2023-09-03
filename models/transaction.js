const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  transactionID: {
    type: String,
    required: true,
  },
  franchiseName: {
    type: Number,
    required: true,
  },
});

const Transactionlist = (module.exports = mongoose.model(
  "Transactionlist",
  transactionSchema
));
