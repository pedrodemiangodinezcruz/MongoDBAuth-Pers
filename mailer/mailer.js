const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'jon.crona78@ethereal.email',
        pass: 't8xFhdknyJRjD67B3P'
    }
});

module.exports = transporter
