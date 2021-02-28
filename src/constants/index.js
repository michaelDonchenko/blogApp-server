const { config } = require('dotenv')
config()

module.exports = {
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.APP_PORT || process.env.PORT, //in deployment to heroku port will be availiable via PORT
  DOMAIN: process.env.APP_DOMAIN,
  SECRET: process.env.APP_SECRET,
  SENDGRID_API: process.env.SENDGRID_API_KEY,
  MJ_APIKEY_PUBLIC: process.env.MJ_APIKEY_PUBLIC,
  MJ_APIKEY_PRIVATE: process.env.MJ_APIKEY_PRIVATE,
}
