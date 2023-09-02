const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  pencil: {
    type: Number,
  },
  bag: {
    type: Number,
  },
  studentAbacus: {
    type: Number,
  },
  listeningAbility: {
    type: Number,
  },
  progressCard: {
    type: Number,
  },
  tshirtsize8: {
    type: Number,
  },
  tshirtsize12: {
    type: Number,
  },
  tshirtsize16: {
    type: Number,
  },
  levelMA: {
    type: Number,
  },
  level2MA: {
    type: Number,
  },
  level3MA: {
    type: Number,
  },
  level4MA: {
    type: Number,
  },
  level5MA: {
    type: Number,
  },
  level6MA: {
    type: Number,
  },
  level1AA: {
    type: Number,
  },
  level2AA: {
    type: Number,
  },
  level3AA: {
    type: Number,
  },
  level4AA: {
    type: Number,
  },
  level5AA: {
    type: Number,
  },
  level6AA: {
    type: Number,
  },
  CB1MA: {
    type: Number,
  },
  CB2MA: {
    type: Number,
  },
  CB3MA: {
    type: Number,
  },
  CB4MA: {
    type: Number,
  },
  CB5MA: {
    type: Number,
  },
  CB6MA: {
    type: Number,
  },
  CB1AA: {
    type: Number,
  },
  CB2AA: {
    type: Number,
  },
  CB3AA: {
    type: Number,
  },
  CB4AA: {
    type: Number,
  },
  CB5AA: {
    type: Number,
  },
  CB6AA: {
    type: Number,
  },
  PB1MA: {
    type: Number,
  },
  PB2MA: {
    type: Number,
  },
  PB3MA: {
    type: Number,
  },
  PB4MA: {
    type: Number,
  },
  PB5MA: {
    type: Number,
  },
  PB6MA: {
    type: Number,
  },
  PB1AA: {
    type: Number,
  },
  PB2AA: {
    type: Number,
  },
  PB3AA: {
    type: Number,
  },
  PB4AA: {
    type: Number,
  },
  PB5AA: {
    type: Number,
  },
  PB6AA: {
    type: Number,
  },
});

const Itemlist = (module.exports = mongoose.model("Itemlist", itemSchema));
