var app = require('express')();
var bodyParser = require('body-parser');
var parser = require('./parser.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/', function (req, res) {

  console.log("Request received.");

  var params = req.body;
  // console.log(params);

  res.header('Access-Control-Allow-Origin', '*');
  parser(params.stu_no, params.passwd, function (table) {
    res.json(JSON.stringify(table));
  });

});

app.get('/search', function (req, res) {
  var q = req.query.q;
  require('request')('http://course.c4labs.xyz/search/?q=' + q, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.header('Access-Control-Allow-Origin', '*');
      res.json(body);
    }
  })
});

app.listen( process.env.PORT || 3000 , function () {
  console.log("Listening on port %s", process.env.PORT || 3000);
});
