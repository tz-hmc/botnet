#!/usr/bin/env node

'use strict'

var mongoose = require('mongoose');

/**
 * Worker schema
 *
 * @type       {<Mongoose.Schema>}
 */

mongoose.connect('mongodb://tzhu:123asdqwezxc@cluster0-shard-00-00-p2ven.mongodb.net:27017,cluster0-shard-00-01-p2ven.mongodb.net:27017,cluster0-shard-00-02-p2ven.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');
var workerSchema = mongoose.Schema({
    worker_id: Number,
    mac_addr: String,
    ip_addr: String,
    status: String
});

var Worker = mongoose.model('Worker', workerSchema);

var testWorker = new Worker({worker_id:0, mac_addr:"test_addr", ip_addr:"test_addr", status:'test'});
testWorker.save(function (err, testWorker) {
  if (err) return console.error(err);
  console.log(testWorker.status);
});

module.exports = Worker;
//var Worker = mongoose.model('Worker', workerSchema);
