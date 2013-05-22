var fs = require('fs');

var JsonDB = function (filename) {
  this._dbFile = filename;
};

JsonDB.prototype._save = function () {
  fs.writeFileSync(this._dbFile, JSON.stringify(this._data));
};

JsonDB.prototype._load = function () {
  var data = fs.readFileSync(this._dbFile, 'utf-8');
  if (!data) {
    data = '{}';
  }
  this._data = JSON.parse(data);
};

JsonDB.prototype.get = function (path) {
  this._load();
  return this._data[path];
};

JsonDB.prototype.incr = function (path, increment) {
  this._load();
  if (typeof increment !== 'number') {
    increment = 1;
  }
  if (typeof this._data[path] !== 'number') {
    this._data[path] = 0;
  }
  this._data[path] += increment;
  this._save();
  return this._data[path];
};

JsonDB.prototype.push = function (path, item) {
  this._load();
  if (!Array.isArray(this._data[path])) {
    this._data[path] = [];
  }
  this._data[path].push(item);
  this._save();
};

JsonDB.prototype.modifyItem = function (path, key, value, newValue) {
  this._load();
  if (!Array.isArray(this._data[path])) {
    this._data[path] = [];
  }

  this._data[path].forEach(function (item, index) {
    if (item[key] === value) {
      this._data[path][index] = newValue;
    }
  }, this);
  this._save();
};

JsonDB.prototype.removeItem = function (path, key, value) {
  this._load();
  if (!Array.isArray(this._data[path])) {
    this._data[path] = [];
  }

  this._data[path].forEach(function (item, index) {
    if (item[key] === parseInt(value, 10)) {
      this._data[path].splice(index, 1);
    }
  }, this);
  this._save();
};

module.exports = JsonDB;
