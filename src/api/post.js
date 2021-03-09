const { Router } = require('express')
const {
  newPost,
  allPosts,
  deletePost,
  updatePost,
} = require('../controllers/post')
const { userAuth } = require('../middlewares/auth-guard')
const { validationMiddleware } = require('../middlewares/validation-middleware')
const {
  postValidators,
  updateValidators,
} = require('../validators/post-validators')

const router = Router()

//////////////////////////////////////////////////////////////////////////////

//add new post
router.post('/post', userAuth, postValidators, validationMiddleware, newPost)

//get all posts
router.get('/posts', allPosts)

//delete post
router.delete('/post/:id', userAuth, deletePost)

//update post
router.put(
  '/post/:id',
  userAuth,
  updateValidators,
  validationMiddleware,
  updatePost
)

module.exports = router
