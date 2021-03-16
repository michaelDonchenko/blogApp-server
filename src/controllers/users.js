const User = require('../models/User')
const { randomBytes } = require('crypto')
const { sendMail } = require('./mail-sender')
const { CLIENT_URL, DOMAIN } = require('../constants')
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
      <a href="${DOMAIN}/api/verify-account/${user.verificationCode}">Verify Account</a>
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

    //check if used is verified
    if (user.verified === false) {
      return res.status(400).json({
        success: false,
        message:
          'Your user is not verified, in order to verify open your mailbox and click the verification link.',
      })
    }

    //generate token and send the user info back
    const token = await user.generateJWT()

    return res.status(200).json({
      success: true,
      message: 'User is now logged in.',
      user: user.getUserInfo(),
      token: `bearer ${token}`,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error accurred',
    })
  }
}

exports.userProfile = async (req, res) => {
  try {
    return await res.status(200).json({ user: req.user, success: true })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error accurred',
    })
  }
}

exports.publicProfile = async (req, res) => {
  try {
    const username = req.params.username
    const user = await User.findOne({ username })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User is not found',
      })
    }

    return res.status(200).json({
      success: true,
      user: user.getUserInfo(),
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error accurred',
    })
  }
}

exports.allUsers = async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10
  const page = req.query.page ? parseInt(req.query.page) : 1

  try {
    const users = await User.find()
      .select('username email verified images')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec()

    const count = await User.find().estimatedDocumentCount()

    if (!users) {
      res.status(404).json({
        success: false,
        message: 'No users found',
      })
    }

    return res.status(200).json({
      success: true,
      users: users,
      count: count,
      pages: Math.ceil(count / limit),
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error accurred',
    })
  }
}

exports.forgotPassword = async (req, res) => {
  try {
    let { email } = req.body
    let user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'The user is not exist.',
      })
    }

    //run resetpassword function
    user.generatePasswordReset()
    await user.save()

    //send reset password email to the user
    let html = `
    <h1>Hello ${user.username},</h1>
    <h2>Do you want to reset your password?</h2>
    <p>Please click the following link in order to reset your password, if you did not request to reset your password just ingore this email.</p>
    <a href="${CLIENT_URL}/password-reset/${user.resetPasswordToken}">Reset Password</a>
    `

    await sendMail(user.email, 'Reset password link', 'Reset password', html)

    return res.status(200).json({
      success: true,
      message:
        'Password reset link was succefully sent to your email, please check your mailbox for further instructions.',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error accurred',
    })
  }
}

exports.updateDetails = async (req, res) => {
  try {
    let { username, about } = req.body
    let id = req.params.id

    let user = await User.findById(id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    if (username !== user.username) {
      let usernameExists = await User.findOne({ username })
      if (usernameExists) {
        return res.status(400).json({
          message: 'This username already exists',
          success: false,
        })
      }
    }

    let updatedUser = await User.findByIdAndUpdate(
      id,
      { username, about },
      { new: true }
    )
    await updatedUser.save()

    return res.status(200).json({ success: true, user: updatedUser })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error accurred',
    })
  }
}

exports.forgotUsername = async (req, res) => {
  let { email } = req.body
  try {
    const user = await User.findOne({ email })

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email address',
      })
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User with that email does not exist',
      })
    }

    let username = user.username

    return res.status(200).json({
      success: true,
      username,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error accurred',
    })
  }
}

exports.passwordResetValidation = async (req, res) => {
  const { resetPasswordToken } = req.params
  try {
    let user = await User.findOne({ resetPasswordToken })
    const date = new Date()

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthoraized access, invalid verification code.',
      })
    }

    if (date > user.resetPasswordExpiresIn) {
      return res.status(401).json({
        success: false,
        message:
          'Your reset passwrod link has been expired, please get a new link in order to reset your password.',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'The token is verified you may change your password now.',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error accurred',
    })
  }
}

exports.passwordResetAction = async (req, res) => {
  const { password, confirmPassword, resetPasswordToken } = req.body

  try {
    let user = await User.findOne({ resetPasswordToken })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthoraized access, invalid verification code.',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password has to be at least 6 characters',
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      })
    }

    user.password = password
    user.resetPasswordToken = undefined

    await user.save()

    return res.status(200).json({
      success: true,
      message:
        'Your password is saved you can now log-in with your new password.',
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error accurred',
    })
  }
}
