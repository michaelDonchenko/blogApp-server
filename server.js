const express = require('express')
const app = express()
const dotenv = require('dotenv')
const connectDB = require('./database')
const cors = require('cors')
dotenv.config()

//init middleware
app.use(express.json({ limit: '5mb' }))

//start DB
connectDB()

//port listener
const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`The app listening at http://localhost:${PORT}`)
})
