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
    // console.log(table);

    var total = 0;
    var counter = 0;

    for (var i = 0; i < table.length; i++) {
      for (var j = 0; j < table[i].length; j++) {
        total += 1;
        var course_no = table[i][j].slice(0,6);
        var text = table[i][j].slice(6);
        table[i][j] = {};
        table[i][j].course_no = course_no;
        table[i][j].text = text;
        function catchCounter() {
          var ii = i;
          var jj = j;
          if (table[i][j].course_no != '') {
            require('request')('http://course.c4labs.xyz/search/?q=' + course_no, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                if ( body != "TMD" ) {
                  var b = JSON.parse(body);
                  if ( b.total > 0) {
                    table[ii][jj].room = b.courses[0].room.replace(/ +/g, " ");
                  } else {
                    console.log("Total = 0");
                    table[ii][jj].room = "";
                  }
                } else {
                  console.log("TMD");
                  table[ii][jj].room = "";
                }
              }

              counter++;
              // console.log(total + ", " + counter + ", table[" + ii + "][" + jj + "]");
              // console.log(table[ii][jj]);

              if (counter == total)
                res.json(JSON.stringify(table));
            });
          } else {
            table[ii][jj].room = "";
            counter++;
          }

        }
        if (params.room == "true")
          catchCounter();
      }
    }

    if (params.room == "false")
      res.json(JSON.stringify(table))

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
