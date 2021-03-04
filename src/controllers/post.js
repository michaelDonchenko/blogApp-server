const Post = require('../models/Post')

//create new post
exports.newPost = async (req, res) => {
  try {
    let { title, body } = req.body

    const post = new Post({
      title,
      body,
      postedBy: req.user._id,
    })

    await post.save()

    return res.status(201).json({
      success: true,
      message: 'Post created succefully',
      post: post,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

//get all posts
exports.allPosts = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 5
    const page = req.query.page ? parseInt(req.query.page) : 1

    const posts = await Post.find()
      .populate('postedBy', 'username email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    const count = await Post.find().estimatedDocumentCount()

    if (!posts) {
      return res.status(404).json({
        success: false,
        message: 'Could not find any posts',
      })
    }

    return res.status(200).json({
      success: true,
      posts: posts,
      count: count,
      pages: Math.ceil(count / limit),
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}
