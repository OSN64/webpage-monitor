var jsdom = require('jsdom');
var fetchUrl = require('fetch').fetchUrl;
var growl = require('growl');

var bodyHandler = function (that) {
  return function (error, meta, body) {
    if (error || !body) {
      return;
    }
    body = body.toString();
    jsdom.env({
      html: body,
      scripts: [
        'http://code.jquery.com/jquery-1.5.min.js'
      ]
    }, function (err, window) {
      var $ = window.jQuery;
      if (!that.lastBody) {
        that.lastBody = window;
      } else if (that.comparison(that.lastBody.jQuery, $)) {
        that.lastBody = window;
      } else {
        that.callback(that.lastBody.jQuery, $);
        that.lastBody = window;
      }
    });
  };
};

function Monitor(url, interval, comparison, callback) {
  if (!callback) {
    callback = comparison;
    comparison = function ($old, $new) {
      return $old('html').html() === $new('html').html();
    };
  }

  this.lastBody = null;
  this.comparison = comparison;
  this.callback = callback;

  var that = this;
  this.intervalId = setInterval(function () {
    fetchUrl(url, bodyHandler(that));
  }, interval);
  fetchUrl(url, bodyHandler(that));
}

Monitor.growl = growl;

module.exports = Monitor;

