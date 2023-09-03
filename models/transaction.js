const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  franchiseName: {
    type: String,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  studentID: {
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
  createdDate: {
    type: Date,
    default: new Date().toLocaleDateString("en-US"),
  },
  currentQuantity: {
    type: Number,
    // required: true,
  },
});

const Transactionlist = (module.exports = mongoose.model(
  "Transactionlist",
  transactionSchema
));
