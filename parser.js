var request = require('./request.js');
var cheerio = require('cheerio')

request('E14026046', 'a2894060', function (html) {
  $ = cheerio.load(html);
  var tbl = $('table tr').get().map(function(row) {
    return $(row).find('td').get().map(function(cell) {
        return $(cell).html();
      });
    });
  console.log(tbl);
})
