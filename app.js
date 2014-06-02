var url  = require('url');
var http = require('http');

var port = process.env.PORT;

http.createServer(function(serverRequest, serverResponse) {
  var requestUrl = url.parse(serverRequest.url);
  var body = [];

  var proxyUrl = url.parse(requestUrl.path.substring(requestUrl.path.indexOf('-_-') + 3));
  
  
  console.log('proxyUrl -- -');
  console.log(proxyUrl);
  
  var proxyHeaders = serverRequest.headers;
  
  // user agent をmobileに書き換えてRequest
  console.log('proxyHeaders -- -');
  
  proxyHeaders['user-agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A403 Safari/8536.25';
  console.log(proxyHeaders);

  serverRequest.on('data', function(data) {
    // リクエストボディを受け取る
    body.push(data);
  });
  
  serverRequest.on('end', function() {

    var request = http.request({
      host:    proxyUrl.host,//serverRequest.headers.host,
      port:    proxyUrl.port || 80,
      path:    proxyUrl.path,
      method:  serverRequest.method,
      headers: proxyHeaders
    },
    function(response) {
        
    console.log('---- response ----');
    console.log(response);
      
      serverResponse.writeHead(response.statusCode, response.headers);
      response.on('data', function(chunk) {
        // 
          
        // 受け取ったデータをクライアントへ送り返す
        serverResponse.write(chunk);
      });
      response.on('end', function() {
        serverResponse.end();
      });
    });
    if(body.length > 0) {
      request.write(body.join(''));
    }
    request.end();
  });
}).listen(port);