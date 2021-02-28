const { MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE } = require('../constants')

const mailjet = require('node-mailjet').connect(
  MJ_APIKEY_PUBLIC,
  MJ_APIKEY_PRIVATE
)

exports.sendMail = async (email, subject, textPart, htmlPart) => {
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'mikesblogapp@gmail.com',
          Name: 'Michael',
        },
        To: [
          {
            Email: email,
          },
        ],
        Subject: subject,
        TextPart: textPart,
        HTMLPart: htmlPart,
        CustomID: 'register verification',
      },
    ],
  })

  request
    .then((result) => {
      console.log('Email succefully sent')
    })
    .catch((err) => {
      console.log(err.statusCode)
    })
}
