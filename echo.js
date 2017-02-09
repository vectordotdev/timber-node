var http = require('http');

http.createServer(function (request, response) {

  response.writeHead(200);

  var body = [];
  request.on('data', function (chunk) {
    body.push(chunk);
  })
  .on('end', function () {
    body = Buffer
      .concat(body)
      .toString();
    console.log(body);
  });

  request.pipe(response);

}).listen(8080);

console.log('listening on 8080');

// test it out with curl -H "Content-Type: application/json" -X POST -d
// '{"username":"xyz","password":"xyz"}' http://localhost:8080