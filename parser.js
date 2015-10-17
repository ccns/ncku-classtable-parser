var request = require('./request.js');
var cheerio = require('cheerio')

function parser(stu_no, passwd, callback) {
  request(stu_no, passwd, function (html) {
    $ = cheerio.load(html, {decodeEntities: false});
    var table = $('table tr').get().map(function(row) {
      return $(row).find('td').get().map(function(cell) {
          return $(cell).html();
        });
      });
    //console.log(table);
    return callback(table);
  })
}

module.exports = parser;
