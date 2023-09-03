const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
});

const Itemlist = (module.exports = mongoose.model("Itemlist", itemSchema));
