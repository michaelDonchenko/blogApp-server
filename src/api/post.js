const { Router } = require('express')
const { newPost, allPosts } = require('../controllers/post')
const { userAuth } = require('../middlewares/auth-guard')
const { validationMiddleware } = require('../middlewares/validation-middleware')
const { postValidators } = require('../validators/post-validators')

const router = Router()

//////////////////////////////////////////////////////////////////////////////

//add new post
router.post('/post', userAuth, postValidators, validationMiddleware, newPost)

//get all posts
router.get('/posts', allPosts)

module.exports = router
