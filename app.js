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

app.listen( process.env.PORT || 3000 , function () {
  console.log("Listening on port %s", process.env.PORT || 3000);
});
