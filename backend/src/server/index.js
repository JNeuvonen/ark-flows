require('dotenv').config({ path: '.env' })
const express = require('express')
const cors = require('cors')
const routes = require('./routes/index')

const app = express()
const PORT = 3001
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}

app.use(cors())
app.use('/api', routes)

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`)
})
