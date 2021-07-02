const redis = require('redis');
var mongoose = require('mongoose');
const Job = require('./models/Job');
const schedule = require('node-schedule');
const mailgun = require("mailgun-js");
const DOMAIN = 'sandbox30106fd34725485e92f7b9739d6e5e3f.mailgun.org';
const API_KEY = '13ea1346285b800b3b6140328c85f649-aff8aa95-90156acc';
const mg = mailgun({apiKey: API_KEY, domain: DOMAIN});

mongoose
  .connect('mongodb://mongodb/jobs', { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    var subscriber = redis.createClient(process.env.REDIS_URL);

    subscriber.on('connect', function() {
        console.log('Worker connected to redis');
    });
    
    subscriber.on("message", async function (channel, message) {
        const objectId = JSON.parse(message).objectId;
        
        Job.findByIdAndUpdate(objectId, { status : 'Processed' }, function(err, job) {
            if(err) {
                console.log(`No object with id ${objectId} could be found.`);
                console.log(err);
            }
            else{ 
                let status = job.status;

                if(status === 'Processed') {
                    console.log('Do nothing.')
                } else {
                    console.log('Processing...');
                
                    const data = {
                        from: job.from,
                        to: job.to,
                        subject: 'Hello from node js web worker',
                        text: job.message
                    };

                    // Every minute
                    // 0 0/1 * * *
                    // * * * * * *
                    // | | | | | |
                    // | | | | | day of week
                    // | | | | month
                    // | | | day of month
                    // | | hour
                    // | minute
                    // second ( optional )
                    // Schedule tasks to be run on the server/ fire and forget.
                    // use job.executeAt instead of hardcoded cron expression

                    // for simplicity queue immediately the message to MailGun API
                    mg.messages().send(data, function (error, body) {
                        console.log(body);
                    });

                    // uncomment to schedule with cron expressions
                    // const job = schedule.scheduleJob('0 0/1 * * *', function() {
                    //     mg.messages().send(data, function (error, body) {
                    //         console.log(body);
                    //     });
                    // });
                }
            }
        });

        console.log("Worker processing : " + objectId);
    });
    
    subscriber.subscribe("jobScheduled");
  })

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));