#!/usr/bin/env node

'use strict'

var mongoose = require('mongoose');

/**
 * Output from work schema
 *
 * @type       {<Mongoose.Schema>}
 */

mongoose.connect('mongodb://tzhu:123asdqwezxc@cluster0-shard-00-00-p2ven.mongodb.net:27017,cluster0-shard-00-01-p2ven.mongodb.net:27017,cluster0-shard-00-02-p2ven.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');
var workSchema = mongoose.Schema({
    work_id: Number,
    worker_id: Number,
    data: String
});

var Work = mongoose.model('Work', workSchema);

var testWork = new Work({work_id:0, worker_id:0, data:'test'});
testWork.save(function (err, testWork) {
  if (err) return console.error(err);
  console.log(testWork.data);
});

module.exports = Work;
