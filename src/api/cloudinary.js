const express = require('express')
const { userAuth } = require('../middlewares/auth-guard')
const router = express.Router()
const cloudinary = require('cloudinary')
const User = require('../models/User')

//cloudinary config

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

//upload image
router.post('/uploadImages', userAuth, async (req, res) => {
  let { image, email } = req.body
  let user = await User.findOne({ email }).exec()
  if (user.images.length >= 10) {
    return res
      .status(400)
      .json({ message: 'Cannot upload more than 10 images', success: false })
  }
  try {
    cloudinary.uploader.upload(image, async (result) => {
      let { public_id, secure_url } = result
      let newImage = { public_id, url: secure_url }

      await user.images.unshift(newImage)

      await user.save()
      let imagesArray = user.images

      return res.status(201).json({ imagesArray, success: true })
    })
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ message: 'An error accoured' })
  }
})

//delete image
router.post('/removeimage', userAuth, async (req, res) => {
  let { imageId, email } = req.body
  if (!imageId) {
    return res
      .status(400)
      .json({ message: 'Could not find the image', success: false })
  }
  try {
    cloudinary.uploader.destroy(imageId, async ({ result }) => {
      if (result === 'ok') {
        let user = await User.findOne({ email }).exec()
        let filtered = await user.images.filter(
          (image) => image.public_id !== imageId
        )

        user.images = filtered
        await user.save()

        let imagesArray = user.images
        return res.status(201).json({ imagesArray, success: true })
      }
      return res
        .status(400)
        .json({ message: 'Could not delete the image', success: false })
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'An error accured' })
  }
})

//set profile image
router.post('/setProfileImage', userAuth, async (req, res) => {
  let { imageId, email } = req.body
  if (!imageId) {
    return res
      .status(400)
      .json({ message: 'Could not find the image', success: false })
  }
  try {
    let user = await User.findOne({ email }).exec()

    let filtered = await user.images.filter(
      (image) => image.public_id !== imageId
    )

    let profileImage = await user.images.filter(
      (image) => image.public_id === imageId
    )

    user.images = filtered

    user.images.unshift(profileImage[0])

    await user.save()

    let imagesArray = user.images
    return res.status(200).json({ imagesArray, success: true })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error accured' })
  }
})

module.exports = router
