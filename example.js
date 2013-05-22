var Monitor = require('./src/monitor');

new Monitor('http://www.v2ex.com?tab=all', 2000, function (old$, new$) {
  var oldTitle = old$('.box .cell.item').first().find('.item_title a').html();
  var newTitle = new$('.box .cell.item').first().find('.item_title a').html();

  return oldTitle === newTitle;
}, function () {
  Monitor.growl('Changed!');
});

