const { Router } = require('express')
const { register, verifyCode } = require('../controllers/users')
const { validationMiddleware } = require('../middlewares/validation-middleware')
const router = Router()

const { registerValidators } = require('../validators/user-validators')

//register
router.post('/register', registerValidators, validationMiddleware, register)

router.get('/verify-account/:verificationCode', verifyCode)

module.exports = router
