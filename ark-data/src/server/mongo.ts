const { MongoClient } = require("mongodb");
const config = require("./utils/config");

const client = new MongoClient(config.ATLAS_URI);

client.connect().then(() => console.log("connected to mongoDB"));

module.exports = client;
