var request = require('./request.js');
var cheerio = require('cheerio')

function parser(stu_no, passwd, callback) {
  request(stu_no, passwd, function (status, data) {
    if(status == 0){
      var html = data;
      $ = cheerio.load(html, {decodeEntities: false});
      var table = $('table tr').get().map(function(row) {
        return $(row).find('td').get().map(function(cell) {
            return $(cell).html().trim();
          });
        });
      //console.log(table);
      return callback(table);
    }else if(status == 1){
      var err = {err: "帳號密碼錯誤"};
      return callback(err);
    }else{
      var err = {err: "未知的錯誤"};
      return callback(err);
    }
  })
}

module.exports = parser;
