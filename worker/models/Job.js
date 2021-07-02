const mongoose = require("mongoose")

var schema = new mongoose.Schema({
    type : String,
    status : String,
    from : String,
    to : String,
    message : String,
    executeAt : String
  });

module.exports = mongoose.model("Job", schema)