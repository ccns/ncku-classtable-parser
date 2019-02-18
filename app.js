var app = require('express')();
var bodyParser = require('body-parser');
var parser = require('./parser.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/', async function (req, res) {

  console.log("Request received.");

  var params = req.body;
  // console.log(params);

  res.header('Access-Control-Allow-Origin', '*');
  try {
    const table = await parser(params.stu_no, params.passwd)
    // console.log(table);

    var total = 0;
    var counter = 0;
    var cached = {};

    for (var i = 0; i < table.length; i++) {
      for (var j = 0; j < table[i].length; j++) {
        total += 1;
        var course_no = table[i][j].slice(0,6);
        var text = table[i][j].slice(6);
        table[i][j] = {};
        table[i][j].course_no = course_no;
        table[i][j].text = text;

        function catchCounter() {
          var ii = i; // closure
          var jj = j;
          if (table[i][j].course_no != '') {
            if(!(course_no in cached)) {
              require('request')('http://140.116.252.148:9202/ncku-course-db/courses/_search?q=' + course_no, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                  var b = JSON.parse(body);
                  if ( b.hits.total > 0) {
                    b = b.hits.hits[0]._source;
                    // console.log(b);
                    if ( (b.dept_no+'-'+b.course_no) == table[ii][jj].course_no ) {
                      table[ii][jj].room = b.classroom;
                      cached[table[ii][jj].course_no] = b.classroom;
                    }
                  } else {
                    console.log("Total = 0");
                    table[ii][jj].room = "";
                  }
                }

                counter++;
                // console.log(total + ", " + counter + ", table[" + ii + "][" + jj + "]");
                // console.log(table[ii][jj]);

                if (counter == total)
                  res.json(JSON.stringify({
                    status: 0,
                    message: 'Success',
                    table: table,
                  }));
              });
            } else {
              console.log(course_no+" cached!");
              table[ii][jj].room = cached[course_no];
              counter++;
            }
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
      res.json(JSON.stringify({
        status: 0,
        message: 'Success',
        table: table,
      }));

  } catch (error) {
    console.error(error);
    res.json(JSON.stringify({
      status: error.status,
      message: error.message,
    }));
  }

});

app.get('/check', function (req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  res.send("I am alive!");
});

app.listen( process.env.PORT || 3000 , function () {
  console.log("Listening on port %s", process.env.PORT || 3000);
});
