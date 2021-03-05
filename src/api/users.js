const { Router } = require('express')
const {
  register,
  verifyCode,
  login,
  userProfile,
  publicProfile,
  forgotPassword,
  allUsers,
} = require('../controllers/users')
const { userAuth } = require('../middlewares/auth-guard')

const { validationMiddleware } = require('../middlewares/validation-middleware')
const router = Router()

const {
  registerValidators,
  authenticateValidators,
  forgotPasswordValidator,
} = require('../validators/user-validators')

//////////////////////////////////////////////////////////////////////////////

//register
router.post('/register', registerValidators, validationMiddleware, register)

//verify user email
router.get('/verify-account/:verificationCode', verifyCode)

//authenticate the user (login)
router.post('/login', authenticateValidators, validationMiddleware, login)

//private user profile
router.get('/user-profile', userAuth, userProfile)

//public user profile
router.get('/public-profile/:id', publicProfile)

//all users
router.get('/users', allUsers)

//forgot password endpoint
router.post(
  '/forgot-password',
  forgotPasswordValidator,
  validationMiddleware,
  forgotPassword
)

//reset password
router.get('/password-reset/:resetPasswordToken', (req, res) => {
  res.json({ message: 'here will be the reset password function' })
})

module.exports = router
