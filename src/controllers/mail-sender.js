const { MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE } = require('../constants')

const mailjet = require('node-mailjet').connect(
  MJ_APIKEY_PUBLIC,
  MJ_APIKEY_PRIVATE
)

exports.sendMail = async (email) => {
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'mikesblogapp@gmail.com',
          Name: 'michael',
        },
        To: [
          {
            Email: email,
          },
        ],
        Subject: 'testing email send after user is created',
        TextPart: 'test with sendmail function',
        HTMLPart: '<h3>Testing this email</h3>',
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
