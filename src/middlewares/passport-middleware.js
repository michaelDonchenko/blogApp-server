const passport = require('passport')
const User = require('../models/User')
const { Strategy, ExtractJwt } = require('passport-jwt')
const { SECRET } = require('../constants')

const opts = {
  secretOrKey: SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}

passport.use(
  new Strategy(opts, async ({ id }, done) => {
    try {
      let user = await User.findById(id)
      if (!user) {
        throw new Error('User not found.')
      }

      return done(null, user.getUserInfo())
    } catch (err) {
      console.log(err.message)
      done(null, false)
    }
  })
)
