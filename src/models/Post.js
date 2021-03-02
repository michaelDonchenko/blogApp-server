const { Schema, model, Types } = require('mongoose')
const { ObjectId } = Types

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    postedBy: {
      type: ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

const Post = model('Post', PostSchema)
module.exports = Post
