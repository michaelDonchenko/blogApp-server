const { check } = require('express-validator')

const username = check('username', 'Username is required').not().isEmpty()
const password = check(
  'password',
  'Password required at least 6 characters'
).isLength({ min: 6 })
const email = check('email', 'Please provide a valid email').isEmail()

module.exports = {
  registerValidators: [username, email, password],
  authenticateValidators: [username, password],
  forgotPasswordValidator: [email],
}
