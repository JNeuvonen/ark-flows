const mongoose = require("mongoose");

const tickerSchema = new mongoose.Schema({
  symbol: {
    type: String,
    require: true,
  },
  companyName: {
    type: String,
    require: true,
  },
  dollars: {
    type: Number,
    require: true,
  },
  shares: {
    type: Number,
    require: true,
  },
  date: {
    type: {},
    require: true,
  },
  stake: {
    type: Number,
    require: true,
  },
  mcap: {
    type: Number,
    require: true,
  },
  fundAllocation: {
    type: {},
    require: true,
  },
});

const aumSchema = new mongoose.schema({
  symbol: {
    type: String,
    require: true,
  },
  date: {
    type: {},
    require: true,
  },
  arkkAUM: {
    type: Number,
    require: true,
  },
  arkfAUM: {
    type: Number,
    require: true,
  },
  arkwAUM: {
    type: Number,
    require: true,
  },
  arkxAUM: {
    type: Number,
    require: true,
  },
  arkgAUM: {
    type: Number,
    require: true,
  },
  arkqAUM: {
    type: Number,
    require: true,
  },
  totalAUM: {
    type: Number,
    require: true,
  },
});
