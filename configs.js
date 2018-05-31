// Name of tables in airtabeBase that should, uh, be updated
exports.airtableTables = ['First_Table', 'Second_Table'];

// Name of column in said tables that should be updated
exports.colToUpdate = 'Last Updated'

// In production, the time will reflect when the job was run, not when the table
// was updated, so code the timestamp as 00:00:00. (The by-the-minute timestamps
// help when debugging, though.)
exports.timeStrings = {
    'development': 'YYYY-MM-DDTHH:mm:ss.000Z',
    'production': 'YYYY-MM-DDT00:00:00.000Z'
}

// The cron format here, translated to ISO time, is: s m H D M d
//     *   means "do on all"
//     */n means "do when value % n == 0"
//     0   means "when value == 0"
// In development, we check for updates every 10 seconds. In production, we do a
// check every day (note that you're sent an e-mail each time the check runs).
exports.cronTimes = {
    'development': '*/10 * * * * *',
    'production': '0 0 15 * * *'
}

// You'll want to change this in production - should match one of the timeStrings
// defined above.
exports.mode = 'development';

// We recommend e-mail notifications if you're running this on a server (you'll be
// able to tell if the server goes down) but otherwise you might not want this
exports.sendEmails = true;