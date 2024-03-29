const { Router } = require('express')
const {
  newPost,
  allPosts,
  deletePost,
  updatePost,
  getPost,
  postsByUser,
  searchQuery,
  like,
  unlike,
  confirmedPosts,
  unconfirmedPosts,
  changeStatus,
  deniedPosts,
  allPostsByUser,
} = require('../controllers/post')
const { adminAuth } = require('../middlewares/admin-middleware')
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

//get confirmed posts
router.get('/confirmed-posts', confirmedPosts)

//get unconfirmed posts
router.get('/unconfirmed-posts', userAuth, adminAuth, unconfirmedPosts)

//get denied posts
router.get('/denied-posts', userAuth, adminAuth, deniedPosts)

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

//get posts by user
router.get('/all-user-posts/:userId', allPostsByUser)

//like
router.put('/like/:postId', userAuth, like)

//unlike
router.put('/unlike/:postId', userAuth, unlike)

//change post status
router.put('/changeStatus/:postId', userAuth, adminAuth, changeStatus)

module.exports = router
