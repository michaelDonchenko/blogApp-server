const User = require('../models/User')
const { randomBytes } = require('crypto')
const { sendMail } = require('./mail-sender')

exports.register = async (req, res) => {
  let { username, email } = req.body

  //check if username exist
  let user = await User.findOne({ username })
  if (user) {
    return res.status(400).json({
      success: false,
      message: 'Username is already taken.',
    })
  }

  //check if email exist
  user = await User.findOne({ email })
  if (user) {
    return res.status(400).json({
      success: false,
      message: 'Email is already registered.',
    })
  }

  user = new User({
    ...req.body,
    verificationCode: randomBytes(20).toString('hex'),
  })

  const result = await user.save()
  res
    .status(201)
    .json({ success: true, message: 'User registered succefully.' })

  //send mail to user
  sendMail(email)
}
