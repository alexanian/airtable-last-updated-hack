var nodemailer = require('nodemailer');
var path = require("path");
var emailTemplates = require('email-templates');

var secrets = require('./secrets');

var transporter = nodemailer.createTransport(secrets.notificationEmail['SMTP']);

/**
 * Function to send an e-mail, which is what you'd expect from this file
*/
exports.sendMail = function(mailData, callback) {
    var mailOptions = {
        'to': secrets.maintainerEmail,
        'from': secrets.notificationEmail['address'],
        'subject': 'Your Airtable Last Updated Hack Just Ran!'
    };

    // Get our jade template file and fill in variables
    emailTemplates('./', function(err, template) {
        template('emailTemplate', mailData, function(err, html, text) {
            mailOptions.html = html;
            mailOptions.text = text;

            // Ship it!
            transporter.sendMail(mailOptions, callback);
        });
    });
}