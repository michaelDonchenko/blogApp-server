const { check } = require('express-validator')

const title = check('title', 'Title is required').not().isEmpty()
const body = check('body', 'Body is required')
  .not()
  .isEmpty()
  .isLength({ min: 200 })
  .withMessage('Blogs cannot be this short, min length is 200 characters')

module.exports = {
  postValidators: [title, body],
  updateValidators: [title, body],
}
