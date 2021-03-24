const { Router } = require('express')
const {
  register,
  verifyCode,
  login,
  userProfile,
  publicProfile,
  forgotPassword,
  allUsers,
  updateDetails,
  forgotUsername,
  passwordResetValidation,
  passwordResetAction,
  banUser,
} = require('../controllers/users')
const { userAuth } = require('../middlewares/auth-guard')
const { adminAuth } = require('../middlewares/admin-middleware')
const { validationMiddleware } = require('../middlewares/validation-middleware')
const router = Router()

const {
  registerValidators,
  authenticateValidators,
  forgotPasswordValidator,
  changeDetailsValidator,
} = require('../validators/user-validators')

//////////////////////////////////////////////////////////////////////////////

//register
router.post('/register', registerValidators, validationMiddleware, register)

//verify user email
router.get('/verify-account/:verificationCode', verifyCode)

//authenticate the user (login)
router.post('/login', authenticateValidators, validationMiddleware, login)

//forgot username
router.post('/forgot-username', forgotUsername)

//private user profile
router.get('/user-profile', userAuth, userProfile)

//public user profile
router.get('/public-profile/:username', publicProfile)

//all users
router.get('/users', allUsers)

//forgot password endpoint
router.post(
  '/forgot-password',
  forgotPasswordValidator,
  validationMiddleware,
  forgotPassword
)

//reset password validation
router.get('/password-reset/:resetPasswordToken', passwordResetValidation)

//reset password action
router.post('/password-reset', passwordResetAction)

//details update
router.post(
  '/update-details/:id',
  userAuth,
  changeDetailsValidator,
  validationMiddleware,
  updateDetails
)

//ban user
router.put('/ban/:userId', userAuth, adminAuth, banUser)

module.exports = router
