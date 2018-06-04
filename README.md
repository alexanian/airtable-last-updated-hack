# airtable-last-updated-hack
Scripts using the [Airtable API](https://airtable.com/api) to allow a "last updated" field

## What's happening here 

You give us the information to connect to an Airtable table, we check it on a schedule you specify
and update a column ('Last Updated', though you can change the name) whenever we detect a change.

Most of the logic exists in `job.js`:

1. On each run, each row in each airtable named in  `configs.airtableTables` is hashed.
2. This hash is compared to what we saw for that row the last time the check was done.
3. If we see a difference, that row is updated with the current date and time.
   1. We delete node's cache of the json each time so that we can actually make a comparison.
   2. Note that we're comparing the row data _except_ the date column that we're updating.
4. After scanning all the rows, out store of hashes for comparison (a .json file, because
   we are High Tech) is updated.
5. If `configs.sendEmails` is set, we send an email indicating that the run happened (if you're
   running this on a server, this will incidentally let you know if it has gone down).

You don't necessarily need to set this up on a server for it to be useful, but it will probably
be more useful that way.

Note that we use an old version of the `email-templates` and `async` packages because they changed
their syntax and we wanted to be able to copy-paste from old code. #OverlyHonestCoding

## Setup

Running this code requires that you already have [node.js](https://nodejs.org/en/) installed.

Download the code! Then navigate to the base directory and install packages with:

```bash
    npm install
```

Get your AirTable API key ([instructions](https://support.airtable.com/hc/en-us/articles/219046777-How-do-I-get-my-API-key-))
and create a `secrets.js` file in the base directory of the repository. Follow the `secrets-template.js`, which includes 
the contents:

```javascript
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
```

You will likely want to update the names of the tables in `configs.js` to match yours:

```javascript
    // Name of tables in airtabeBase that should, uh, be updated
    exports.airtableTables = ['TABLE_NAME', 'ANOTHER_TABLE_NAME'];
```

If you want to run this in production (i.e. acknowledging that the timestamps for this hack are not
meaningful) then you will wish to edit the mode in `configs.js`:

```javascript
    exports.mode = 'production';
```

If you don't want email notifications, you can enter dummy values for the email-related settings and
change the flag in `configs.js`:

```javascript
    exports.sendEmails = false;
```
You can start the cron job by calling:

```bash
    node runner.js
```
The cron job is set to run every 10 seconds because debugging. You can change this in `runner.js`.

If you don't want to run this with a cron job, you can also run the job from the node interpreter:

```node
   // Within the node interpreter
   var job = require('./job');
   job.hackLastUpdated();
```

### Example: setting up a server to run this job

As above, you don't _have_ to run this on a server. It's nicer and more automatic this way. We ended
up using a DreamCompute instance for this, which has the following
[set up instructions](dreamcompute_link) but YMMV.

Command to access the instance (substitute the name of your ssh file and IP):

```bash
    ssh -i ~/.ssh/last-updated-host.pem ubuntu@XXX.XXX.XXX.XXX
```

Then, once on the server, we ran the following in sequence:

```bash
    curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
    sudo apt-get install -y nodejs
    sudo apt install npm
    git clone https://github.com/alexanian/airtable-last-updated-hack
    cd airtable-last-updated-hack/
    npm install
    cp secrets-template.js secrets.js
```

The `secrets.js` file was updated by consulting:

1. Our base's API page (located at `https://airtable.com/BASE_NAME/api/docs`, but we found it by
   following the link under the *Help* menu).
2. The SMTP server for a gmail account we'd set up. You can follow this
   [Digital Ocean tutorial](smtp_link) to do the same.

Then you'll want to update `configs.js` with information about your table and to switch the
`mode` to production. (It's possible you'll also want to change the time strings in `configs.js`.)

Now install the package you'll be using to run the job in the background:

```bash
    sudo npm install pm2 -g
    sudo pm2 start pm2.ecosystem.json --only last-updated-hack
```

You can see what's running with:

```bash
    sudo pm2 list
```

And the last few (here, five) lines of logs with:

```bash
    sudo pm2 logs --lines 5
```
To ensure the job keeps running even if your server restarts, run the following:

```bash
    sudo pm2 save
    sudo pm2 startup ubuntu
```

[dreamcompute_link]: https://help.dreamhost.com/hc/en-us/articles/215912848-How-to-launch-and-manage-instances-with-the-DreamCompute-dashboard
[smtp_link]: https://www.digitalocean.com/community/tutorials/how-to-use-google-s-smtp-server


## Troubleshooting

### Emails do not send

You might need to "Allow less secure apps" or something similar to be able to send e-mails with
your SMTP string. For example, we saw the error `Error: Invalid login: 534-5.7.14` when using a
gmail address.

We also saw Google (sensibly) block the e-mail once we tried sending from our server, since said
server was in Brazil. Check your SMTP e-mail for security alerts.

## Acknowledgements

Shout out to [Zachary Jacobi](https://github.com/zejacobi), my designated pair programming buddy,
both virtually and in person, for nearly every line of code in this repository.
