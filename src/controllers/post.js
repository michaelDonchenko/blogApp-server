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
      .populate('postedBy', 'username email images')
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

exports.deletePost = async (req, res) => {
  const id = req.params.id
  const user = req.user
  const post = await Post.findById(id)
  try {
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      })
    }

    if (String(post.postedBy) !== String(user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You do not have permission to delete this post',
      })
    }

    await post.delete()
    return res.status(200).json({
      success: true,
      message: 'Post deleted succefully',
      deleted: post,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

exports.updatePost = async (req, res) => {
  const id = req.params.id
  const user = req.user
  let post = await Post.findById(id)
  const { title, body } = req.body
  try {
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      })
    }

    if (String(post.postedBy) !== String(user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You do not have permission to update this post',
      })
    }

    await post.updateOne({ title, body })
    return res.status(200).json({
      success: true,
      message: 'Post updated succefully',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

exports.getPost = async (req, res) => {
  let id = req.params.id
  try {
    const post = await Post.findById(id).populate(
      'postedBy',
      'username email images'
    )

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      })
    }

    return res.status(200).json({
      success: true,
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

exports.postsByUser = async (req, res) => {
  const userId = req.params.userId
  const limit = req.query.limit ? parseInt(req.query.limit) : 5
  const page = req.query.page ? parseInt(req.query.page) : 1

  try {
    const posts = await Post.find({ postedBy: userId })
      .select('title createdAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    const count = await Post.find({ postedBy: userId }).countDocuments().exec()

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

exports.searchQuery = async (req, res) => {
  let { keyword } = req.body
  const limit = req.query.limit ? parseInt(req.query.limit) : 5
  const page = req.query.page ? parseInt(req.query.page) : 1

  try {
    const posts = await Post.find({ $text: { $search: keyword } })
      .populate('postedBy', 'username email images')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec()

    if (!posts) {
      return res.status(404).json({
        success: false,
        message: 'Could not find any posts',
      })
    }

    const count = await Post.find({
      $text: { $search: keyword },
    }).countDocuments()

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
