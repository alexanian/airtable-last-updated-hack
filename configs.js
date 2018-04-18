// Name of tables in airtabeBase that should, uh, be updated
exports.airtableTables = ['First_Table', 'Second_Table'];

// Name of column in said tables that should be updated
exports.colToUpdate = 'Last Updated'

// In production, the time will reflect when the job was run, not when the table
// was updated, so code the timestamp as 00:00:00. (Timestamps help debugging.)
exports.timeStrings = {
    'development': 'YYYY-MM-DDTHH:mm:ss.000Z',
    'production': 'YYYY-MM-DDT00:00:00.000Z'
}

// You'll want to change this in production - should match one of the timeStrings
// defined above.
exports.mode = 'development';