#!/usr/bin/env node
'use strict'

// Connect to bots
var net = require('net');
var PORT = 6969
var HOST = "127.0.0.1"

// Database connection
//var mongoose = require('mongoose');
//mongoose.connect('mongodb://tzhu:123asdqwezxc@cluster0-shard-00-00-p2ven.mongodb.net:27017,cluster0-shard-00-01-p2ven.mongodb.net:27017,cluster0-shard-00-02-p2ven.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');
//var db = mongoose.connection;
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

console.log(process.argv);

program
  .option('-s, --status', 'Print all worker information, including statuses')
  .option('-c, --check', 'Ask workers to check in')
  .option('-e, --execute [ex_command]', 'Send command to workers')
  .option('-r, --report', 'Print all data returned by workers')
  .option('-k, --killall', 'Kill all bots')
  .parse(process.argv);

// For debugging purposes:
//var program = {execute: true, check:false, report:false, killall: false, status: false, ex_command: "ls"}
console.log(program.execute);
if (program.args.length === 0) program.help();
if(program.status) {
  console.log("Printing all worker information: ");
  Worker.find(function (err, workers) {
    if (err) return console.error(err);
    workers.forEach(function(worker) {
      console.log(worker);
    });
  });
}
if(program.check) {
  console.log("Asking for workers to check in: ");
  Worker.find(function (err, workers) {
    if (err) return console.error(err);
    workers.forEach(function(worker) {
      var client = new net.Socket();
      client.connect(PORT, HOST, function(){
        client.write("handshake: ");
      });
      client.on("error", function(err) {
        return console.error(err);
      });
      client.on("data", function(data, err) {
        console.log(worker.ip_addr.concat(": "+data.toString()));
        client.destroy();
        // update Worker status
      });
      client.on("end", function() {
        console.log(worker.ip_addr.concat(": disconnected from server"));
      });
    });
  });
}
if(program.execute) {
  console.log("Executing given command: ");
  Worker.find(function (err, workers) {
    workers.forEach(function(worker) {
      var client = new net.Socket();
      client.connect(PORT, worker.ip_addr, function(){
        console.log("Sending command to worker: "+worker.ip_addr);
        client.write("execute: "+ program.execute);
      });
      client.on("data", function(d, err) {
        console.log(worker.ip_addr+": "+d.toString());
        client.destroy();
        var new_work = new Work({worker_id: worker.worker_id, data: d.toString()});
        new_work.save(function (err) {
          if (err) return console.error(err);
        });
      });
      client.on("error", function(err) {
        return console.error(err);
      });
    });
  });
}
if(program.report) {
  console.log("Printing out returned data: ");
  Work.find(function (err, works) {
    if (err) return console.error(err);
    works.forEach(function(work) {
      console.log(work);
    });
  });
}
if(program.killall) {
  console.log("Killing all bot data: ")
  Worker.remove({}, function (err, work) {
    if (err) return console.error(err);
    console.log(work);
  })
  Work.remove({}, function (err, work) {
    if (err) return console.error(err);
    console.log(work);
  })
}
