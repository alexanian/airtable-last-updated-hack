var CronJob = require('cron').CronJob;
var job = require('./job');

// You may want to change this in production!
// The cron format here, translated to ISO time, is: s m H D M d
// * means "do on all", */n means "do when value % n == 0"
// So here, we're saying update every 10 seconds
var cronTime = '*/10 * * * * *';

// Set up a new cron job!
var runTheHack = new CronJob(cronTime, job.hackLastUpdated, null, true);
