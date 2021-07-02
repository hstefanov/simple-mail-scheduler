const express = require("express")
const redis = require('redis');
const Job = require("../models/Job")
var publisher = redis.createClient(process.env.REDIS_URL);

publisher.on('connect', function() {
    console.log('Publisher connected to redis');
});

const router = express.Router()

 // Schedule task to be executed
 router.post('/schedule', async function (req, res) {

    const { type, status, from, to, message, executeAt } = req.body.job;
    
    var job = new Job({ 
      type: type,
      status: status,
      from : from,
      to : to,
      message : message,
      executeAt: executeAt
    });
    
    await job.save().then((item) => {
      console.log('Saving...');

      // Publish message to all subscribers to process FIFO
      publisher.publish("jobScheduled", JSON.stringify({ objectId : item._id}), function(){
          console.log("Message published");
      });

      res.status(200).json({ 
        message : 'Job has beeen scheduled' 
      });
    }).catch(() => {
      console.log('error');
      res.status(200).json({ 
        message : 'Item was not saved to the database' 
      });
    });
})

module.exports = router