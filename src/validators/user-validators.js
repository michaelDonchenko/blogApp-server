const { check } = require('express-validator')

const username = check('username', 'Username is required')
  .not()
  .isEmpty()
  .isLength({ min: 2, max: 15 })
  .withMessage('Username has to be between 2 to 15 characters')
const password = check(
  'password',
  'Password has to be between 6-15 characters'
).isLength({ min: 6, max: 15 })
const email = check('email', 'Please provide a valid email').isEmail()

module.exports = {
  registerValidators: [username, email, password],
  authenticateValidators: [username, password],
  forgotPasswordValidator: [email],
  changeDetailsValidator: [username],
}
