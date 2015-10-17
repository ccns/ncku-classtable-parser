var http = require('http');
var parser = require('./parser.js');

http.createServer(function (req, res) {
  console.log("Request received.");
  var body = "";
  req.on('data', function (chunk) {
    body += chunk;
  });
  req.on('end', function () {
    //console.log('POSTed: ' + body);

    var ps = body.split('&');
    var params = {};
    for (var i = 0; i < ps.length; i++) {
      p = ps[i].split('=');
      params[p[0]] = p[1];
    }

    //console.log(params);
    res.writeHead(200);

    parser(params.stu_no, params.passwd, function (table) {
      res.end(JSON.stringify(table));
    });

  });
}).listen( process.env.PORT || 3000 , function () {
  console.log("Listening on port %s", process.env.PORT || 3000);
});
