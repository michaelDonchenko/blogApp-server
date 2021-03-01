const express = require('express')
const connectDB = require('./database')
const cors = require('cors')
const { PORT } = require('./constants')
const passport = require('passport')

const app = express()

//import passport middleware
require('./middlewares/passport-middleware')

//init middleware
app.use(express.json({ limit: '5mb' }))
app.use(cors())
app.use(passport.initialize())

//Router exports
const userRoutes = require('./api/users')

//inject sub routes and apis
app.use('/api', userRoutes)

const main = () => {
  try {
    //start DB
    connectDB()
    //start the server
    app.listen(PORT, () => {
      console.log(`The app listening at http://localhost:${PORT}`)
    })
  } catch (error) {
    console.log(`Error: ${error.message}`)
  }
}

main()
