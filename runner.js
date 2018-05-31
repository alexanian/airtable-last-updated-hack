var CronJob = require('cron').CronJob;
var configs = require('./configs');
var job = require('./job');

// Read the scheduling string from the configs file
var cronTime = configs.cronTimes[configs.mode];

// Set up a new cron job!
var runTheHack = new CronJob(cronTime, job.hackLastUpdated, null, true);
