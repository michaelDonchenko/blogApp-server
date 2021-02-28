const mongoose = require('mongoose')
const { MONGO_URI } = require('../constants')

const connectDB = () => {
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log('MongoDB Connected')
    })
    .catch((err) => {
      console.log(err.message)
    })
}

mongoose.set('useCreateIndex', true)

module.exports = connectDB
