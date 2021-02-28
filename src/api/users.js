const { Router } = require('express')
const { register } = require('../controllers/users')
const { validationMiddleware } = require('../middlewares/validation-middleware')
const router = Router()

const { registerValidators } = require('../validators/user-validators')

//register
router.post('/register', registerValidators, validationMiddleware, register)

module.exports = router
