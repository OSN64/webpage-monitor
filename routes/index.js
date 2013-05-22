var JsonDb = require('../src/db');
var db = new JsonDb(__dirname + '/../db.json');

var nodemailer = require('nodemailer');

var Monitor = require('../src/monitor');

var intervals = [];
function starMoniter() {
  intervals.forEach(function (interval) {
    clearInterval(interval);
  });
  intervals = [];
  var taskList = db.get('taskList');
  if (!Array.isArray(taskList)) {
    taskList = [];
  }
  taskList.forEach(function (task) {
    var monitor = new Monitor(task.url, task.interval * 1000, function ($old, $new) {
      return eval(task.compareFunc);
    }, function ($old, $new) {
      var transport = nodemailer.createTransport('Sendmail');
      transport.sendMail({
        from: 'notify@webpagemonitor.com',
        to: task.email,
        subject: '监控项目"' + task.name + '"发生变动',
        text: '监控项目发生变动'
      });
    });
    intervals.push(monitor.intervalId);
  });
}

exports.index = function (req, res) {
  res.render('index');
};

exports.taskIndex = function (req, res) {
  res.render('taskList');
};

exports.taskList = function (req, res) {
  var taskList = db.get('taskList');
  if (!Array.isArray(taskList)) {
    taskList = [];
  }
  res.json({taskList: taskList});
};

exports.newTask = function (req, res) {
  var id = db.incr('taskId');
  var task = {
    id: id,
    name: req.body.name,
    url: req.body.url,
    interval: req.body.interval,
    email: req.body.email,
    compareFunc: req.body.compareFunc,
    callbackTemplate: req.body.callbackTemplate
  };
  db.push('taskList', task);
  res.json({});
  starMoniter();
};

exports.editTask = function (req, res) {
  var task = {
    id: req.body.id,
    name: req.body.name,
    url: req.body.url,
    interval: req.body.interval,
    email: req.body.email,
    compareFunc: req.body.compareFunc
  };
  db.modifyItem('taskList', 'id', req.body.id, task);
  res.json({});
  starMoniter();
};

exports.removeTask = function (req, res) {
  db.removeItem('taskList', 'id', req.params.taskId);
  res.json({});
  starMoniter();
};

