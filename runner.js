var CronJob = require('cron').CronJob;
var job = require('./job');

// Set up a new cron job!
// The cron format here, translated to ISO time, is: s m H D M d
// * means "do on all", */n means "do when value % n == 0"
// So here, we're saying update every 10 seconds
var runHack = new CronJob('*/10 * * * * *', job.hackLastUpdated, null, true);
