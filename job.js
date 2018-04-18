var airtable = require('airtable');
var md5 = require('md5');
var moment = require('moment');
var fs = require('fs');
var secrets = require('./secrets');
var configs = require('./configs');


// Set up connection to Airtable
airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: secrets.apiKey
});
var base = airtable.base(secrets.airtableBase);

// Create local storage for hashes of records
var hashDir = './localStorage/';
if (!fs.existsSync(hashDir)) {
    fs.mkdirSync(hashDir);
}

exports.hackLastUpdated = function hackLastUpdated() {
    // Retrieve records from all tables listed
    configs.airtableTables.forEach(table => {
        var hashPath = hashDir + table + '.json';
        var hashes = {};

        // Get previous data, if it exists
        var previous, previousExists;    
        try {
            previous = require(hashPath);
            previousExists = true;
        }
        catch (e) {
            previous = {};
            previousExists = false;
        }

        base(table).select().eachPage(
            function page(records, fetchNextPage) {
                records.forEach(record => {

                    // Ignore Airtable metadata
                    var id = record['_rawJson']['id']
                    var fields = record['_rawJson']['fields'];

                    // If we don't delete this before comparison, we could
                    // get confused by the order of writing and storing records
                    delete fields[configs.colToUpdate];

                    // Store the md5 of the current record
                    var hash = md5(JSON.stringify(fields));
                    hashes[id] = hash;

                    if (previousExists) {
                        if (hash != previous[id]) {
                            // Get the current date (or date + time, if in development)
                            var lastUpdated = moment().format(configs.timeStrings[configs.mode]);
                            var update = {};
                            update[configs.colToUpdate] = lastUpdated;

                            // Update your last_updated field, woo!
                            base(table).update(id, update, function(err, record) {
                                if (err) { console.error(err); return; }
                            });
                            console.log('Updated', id, fields);
                        }
                    }
                });

                // To fetch the next page of records, call `fetchNextPage`.
                // If there are more records, `page` will get called again.
                // If there are no more records, `done` will get called.
                fetchNextPage();
            }, function done(err) {
                // Log any errors
                if (err) { console.error(err); return; }

                // The cron job ends up infinitely updating if you don't delete this cache
                delete require.cache[require.resolve(hashPath)];

                // Write retrieved hashes to a file
                fs.writeFileSync(hashPath, JSON.stringify(hashes));
            }
        );
    })
};