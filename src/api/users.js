const { Router } = require('express')
const { register, verifyCode, login } = require('../controllers/users')
const { validationMiddleware } = require('../middlewares/validation-middleware')
const router = Router()

const {
  registerValidators,
  authenticateValidators,
} = require('../validators/user-validators')

//register
router.post('/register', registerValidators, validationMiddleware, register)

//verify user email
router.get('/verify-account/:verificationCode', verifyCode)

//authenticate the user (login)
router.post('/login', authenticateValidators, validationMiddleware, login)

module.exports = router
