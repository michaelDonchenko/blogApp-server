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
    views: { type: Number, default: 0 },
    likes: [{ type: ObjectId, ref: 'User' }],
    status: {
      type: String,
      default: 'not confirmed',
      enum: ['not confirmed', 'confirmed', 'denied'],
      required: true,
    },
    declineReason: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)
PostSchema.index({ title: 'text', body: 'text' })

const Post = model('Post', PostSchema)
module.exports = Post
