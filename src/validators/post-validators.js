const { check } = require('express-validator')

const title = check('title', 'Title is required').not().isEmpty()
const body = check('body', 'Body is required').not().isEmpty()

module.exports = {
  postValidators: [title, body],
}
