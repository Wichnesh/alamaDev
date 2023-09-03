const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  transactionID: {
    type: String,
    required: true,
  },
  franchiseName: {
    type: String,
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const Transactionlist = (module.exports = mongoose.model(
  "Transactionlist",
  transactionSchema
));
