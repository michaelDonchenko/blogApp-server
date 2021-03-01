const User = require('../models/User')
const { randomBytes } = require('crypto')
const { sendMail } = require('./mail-sender')
const { DOMAIN } = require('../constants')
const { join } = require('path')

exports.register = async (req, res) => {
  try {
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

    await user.save()

    let html = `
      <h1>Hello ${user.username},</h1>
      <h2>Welcome to the best blog site!</h2>
      <p>Please click the following link in order to verify your account</p>
      <a href="${DOMAIN}/api/verify-account/${user.verificationCode}">Verify now</a>
      `

    //send mail to user
    await sendMail(
      user.email,
      'Verified account',
      'Please verify your account',
      html
    )

    res.status(201).json({
      success: true,
      message: `The registration was succefull, please check your mailbox at ${user.email} in order to verify your account.`,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}

exports.verifyCode = async (req, res) => {
  try {
    let { verificationCode } = req.params
    let user = await User.findOne({ verificationCode })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthoraized access, invalid verification code.',
      })
    }

    user.verified = true
    user.verificationCode = undefined
    await user.save()

    return res.sendFile(
      join(__dirname, '../templates/verification-success.html')
    )
  } catch (error) {
    console.log(error.message)
    return res.sendFile(join(__dirname, '../templates/errors.html'))
  }
}

exports.login = async (req, res) => {
  try {
    let { username, password } = req.body

    //check if user exist
    let user = await User.findOne({ username })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'There is no user with such username.',
      })
    }

    //check if user used the currect password
    const truePassword = await user.comparePassword(password)
    if (!truePassword) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect password.',
      })
    }

    //generate token and send the user info back
    const token = await user.generateJWT()

    return res.status(200).json({
      success: true,
      message: 'User is now logged in.',
      user: user.getUserInfo(),
      token: `Bearer ${token}`,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error accurred',
    })
  }
}
