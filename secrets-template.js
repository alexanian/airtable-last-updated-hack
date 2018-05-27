// API key for Airtable base
exports.apiKey = 'YOUR_API_KEY';

// Name of Airtable base to use
// Findable by clicking 'Help' in your base, then selecting 'API documentation'
exports.airtableBase = 'BASE_ID';

// Connection string for e-mail to use for notifications
// Probably don't use your personal e-mail, but YMMV
exports.notificationEmail = {
    'address': 'AN_EMAIL_YOU_MADE@SOME_SERVER.COM',
    'SMTP': 'smtps://AN_EMAIL_YOU_MADE@SOME_SERVER.COM:YOUR_PASSWORD@smtp.SOME_SERVER.COM' 
};

// You'll want to change this to your email, so you can see all those sweet notifications
// and be alarmed when they don't appear
exports.maintainerEmail = 'YOUR_EMAIL@PROBABLYGMAIL.COM';