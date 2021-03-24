const { Schema, model } = require('mongoose')
const { hash, compare } = require('bcryptjs')
const { sign } = require('jsonwebtoken')
const { SECRET } = require('../constants')
const { randomBytes } = require('crypto')
const { pick } = require('lodash')

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      required: false,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpiresIn: {
      type: Date,
      required: false,
    },
    images: {
      type: Array,
      default: {
        url: 'https://via.placeholder.com/300x300.png?text=User%20image',
        public_id: Date.now(),
      },
    },
    about: {
      type: String,
    },
    banned: {
      type: Boolean,
      default: false,
    },
    banReason: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: 'subscriber',
    },
  },
  { timestamps: true }
)

UserSchema.pre('save', async function (next) {
  let user = this
  //if password did not change return next
  if (!user.isModified('password')) return next()

  //else if password changed
  user.password = await hash(user.password, 10)
  next()
})

UserSchema.methods.comparePassword = async function (password) {
  return await compare(password, this.password)
}

UserSchema.methods.generateJWT = async function () {
  let payload = {
    username: this.username,
    email: this.email,
    id: this._id,
    name: this.name,
  }
  return await sign(payload, SECRET)
}

UserSchema.methods.generatePasswordReset = function () {
  this.resetPasswordExpiresIn = Date.now() + 3600000
  this.resetPasswordToken = randomBytes(20).toString('hex')
}

UserSchema.methods.getUserInfo = function () {
  return pick(this, [
    '_id',
    'email',
    'username',
    'verified',
    'images',
    'about',
    'role',
  ])
}

const User = model('User', UserSchema)
module.exports = User
