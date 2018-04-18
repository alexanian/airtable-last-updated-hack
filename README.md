# airtable-last-updated-hack
Scripts using the [Airtable API](https://airtable.com/api) to allow a "last updated" field

## Setup

Running this code requires that you already have [node.js](https://nodejs.org/en/) installed.

Download the code! Then navigate to the base directory and install packages with:

    npm install

Get your AirTable API key ([instructions](https://support.airtable.com/hc/en-us/articles/219046777-How-do-I-get-my-API-key-))
and create a `secrets.js` file in the base directory of the repository with the contents:

    // API key for Airtable base
    exports.apiKey = 'YOUR_API_KEY';

    // Name of Airtable base to use
    // Findable by clicking 'Help' in your base, then selecting 'API documentation'
    exports.airtableBase = 'BASE_ID';

If you want to run this in production (i.e. acknowledging that the timestamps for this hack are not
meaningful) then you will wish to edit the mode in `configs.js`:

    exports.mode = 'production';

You can run the script by calling

    node job.js
  
It writes some files and logs to the console right now, but doesn't do much else. 