require('dotenv').config({ path: '.env' })

const { MongoClient } = require('mongodb')

const mongoClient = new MongoClient(process.env.MONGODB_URI)

mongoClient.connect().then(() => console.log('connected to mongoDB'))

module.exports = mongoClient
