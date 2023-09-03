const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  count: {
    type: Number,
  },
});

const Itemlist = (module.exports = mongoose.model("Itemlist", itemSchema));
