var request = require('./request.js');
var cheerio = require('cheerio')

async function parser(stu_no, passwd) {
  const schedule_html = await request(stu_no, passwd);
  $ = cheerio.load(schedule_html, {decodeEntities: false});
  var table = $('table tr').get().map(function(row) {
    return $(row).find('td').get().map(function(cell) {
        return $(cell).html().trim();
      });
    });
  //console.log(table);
  return table;
}

module.exports = parser;
