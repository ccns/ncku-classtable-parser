var request = require('request');
var iconv = require('iconv-lite');
var sha1 = require('node-sha1');

var stu_no = '';
var passwd = '';
var id_no = '60f1a2928afc7fc23b2f0c0dd591dd3f17fd95a4';

var j = request.jar()
var request = request.defaults({encoding:null,jar: j})

function get(stu_no, passwd, callback) {
  var form = {
    stu_no: stu_no,
    passwd: passwd,
    id_no: id_no
  }

  // connecting test
  request('https://course.sso2.ncku.edu.tw/course/login.php', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(j) // watch jar
      loginSSO(formSSO, callback);
    }
  })
}

function logout() {
  request('https://course.sso2.ncku.edu.tw/course/logout.php',
  function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var str = iconv.decode(new Buffer(body), "big5");
      //console.log(str);
    }
  });// logout request
}

function login(form, callback) {
  request.post({
      url:'https://course.sso2.ncku.edu.tw/course/login.php',
      form: form
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var str = iconv.decode(new Buffer(body), "big5");
        console.log("login response length: " + str.length); // login success when str.length < 80

        if(str.length < 80) {
          request('https://course.sso2.ncku.edu.tw/course/schedule.php',
            function (error, response, body) {
              if (!error && response.statusCode == 200) {
                var str = iconv.decode(new Buffer(body), "big5");
                //console.log(str);
                logout();
                return callback(str);
              }
            })// schedule request
        }else if(str.length > 300 && str.length < 320){
          logout();
          login(form, callback);
        }else{
          return callback(-1);
        }

      }
    });// login request
}

module.exports = get;
