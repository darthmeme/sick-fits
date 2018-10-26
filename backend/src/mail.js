const nodemailer = require('nodemailer')
const mailgun = require('nodemailer-mailgun-transport');

const mailgunTransport = mailgun({
  auth: {
    api_key: process.env.MAILGUN_APIKEY,
    domain: process.env.MAILGUN_DOMAIN
  }
})

exports.transport = nodemailer.createTransport(mailgunTransport)

exports.makeANiceEmail = text => `
  <div className="email" style="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;
  ">
    <h2>Hello there</h2>
    <p>${text}</p>
  </div>
`
