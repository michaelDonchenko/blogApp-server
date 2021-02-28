const { check } = require('express-validator')

const name = check('name', 'Name is required').not().isEmpty()
const username = check('username', 'Username is required').not().isEmpty()
const password = check(
  'password',
  'Password required at least 6 characters'
).isLength({ min: 6 })
const email = check('email', 'Please provide a valid email').isEmail()

module.exports = {
  registerValidators: [name, username, email, password],
  authenticateValidators: [username, password],
}
