const { Router } = require('express')
const {
  newPost,
  allPosts,
  deletePost,
  updatePost,
  getPost,
  postsByUser,
  searchQuery,
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

//get single post
router.get('/post/:id', getPost)

//delete post
router.delete('/post/:id', userAuth, deletePost)

router.post('/searchQuery', searchQuery)

//update post
router.put(
  '/post/:id',
  userAuth,
  updateValidators,
  validationMiddleware,
  updatePost
)

//get posts by user
router.get('/user-posts/:userId', postsByUser)

module.exports = router
