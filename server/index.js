const express = require('express');
const port = process.env.PORT || 4000;
var cors = require('cors');
var mongoose = require('mongoose');
const routes = require('./routes/routes')

mongoose
  .connect('mongodb://mongodb/jobs', { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    const app = express();
    app.use(express.json())
    app.use(cors());

    app.use("/api", routes);

    app.listen(port, () => {
      console.log(`Simple restfull service for scheduling mail jobs at url http://localhost:${port}`);
    });
  })

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


