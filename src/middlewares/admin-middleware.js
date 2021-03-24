exports.adminAuth = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      console.log(req.user)
      return res.status(401).json({
        success: false,
        message: 'Resource denied, not admin user.',
      })
    }
    next()
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      success: false,
      message: 'An error occurred',
    })
  }
}
