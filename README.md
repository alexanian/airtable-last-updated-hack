# airtable-last-updated-hack
Scripts using the [Airtable API](https://airtable.com/api) to allow a "last updated" field

## What's happening here 

You give us the information to connect to an Airtable table, we check it on a schedule you specify
and update a column ('Last Updated', though you can change the name) whenever we detect a change.

Most of the logic exists in `job.js`.

Note that we use an old version of the `email-templates` and `async` packages because they changed
their syntax and we wanted to be able to copy-paste from old code. #OverlyHonestCoding

## Setup

Running this code requires that you already have [node.js](https://nodejs.org/en/) installed.

Download the code! Then navigate to the base directory and install packages with:

    npm install

Get your AirTable API key ([instructions](https://support.airtable.com/hc/en-us/articles/219046777-How-do-I-get-my-API-key-))
and create a `secrets.js` file in the base directory of the repository. Follow the `secrets-template.js`, which includes 
the contents:

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

You will likely want to update the names of the tables in `configs.js` to match yours:

    // Name of tables in airtabeBase that should, uh, be updated
    exports.airtableTables = ['TABLE_NAME', 'ANOTHER_TABLE_NAME'];

If you want to run this in production (i.e. acknowledging that the timestamps for this hack are not
meaningful) then you will wish to edit the mode in `configs.js`:

    exports.mode = 'production';

If you don't want email notifications, you can enter dummy values for the email-related settings and
change the flag in `configs.js`:

    exports.sendEmails = false;

You can start the cron job by calling:

    node runner.js
  
The cron job is set to run every 10 seconds because debugging. You can change this in `runner.js`.

## Troubleshooting

### Emails do not send

You might need to "Allow less secure apps" or something similar to be able to send e-mails with
your SMTP string. For example, we saw the error `Error: Invalid login: 534-5.7.14` when using a
gmail address.

## Acknowledgements

Shout out to [Zachary Jacobi](https://github.com/zejacobi), my designated pair programming buddy,
both virtually and in person, for nearly every line of code in this repository.
