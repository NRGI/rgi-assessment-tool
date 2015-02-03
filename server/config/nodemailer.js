var	nodemailer	= require('nodemailer');

var transporter = nodemailer.createTransport();
transporter.sendMail({
    from: 'sender@address',
    to: 'receiver@address',
    subject: 'hello',
    text: 'hello world!'
});