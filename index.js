var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000

app.use(express.static(__dirname + "/"))

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

var globalCounter = 0;
var clientCount = 0; // poor-mans non-scalable db
var color = getRandomColor();
var allClients = {};

var colorLoop = setInterval(function() {
  	color = getRandomColor();

  	var serverData = [new Date(), clientCount, color];

  	// send to all clients
	for (conn in allClients)
		allClients[conn].send(JSON.stringify(serverData), function() {  });
  
  }, 1000)

wss.on("connection", function(ws) {


  /*
  var id = setInterval(function() {
  	var serverData = [new Date(), clientCount, color];
    ws.send(JSON.stringify(serverData), function() {  })
  }, 1000)
  */

  clientCount++;
  var id = globalCounter++;
  ws.id = id;
  allClients[ws.id] = ws;

  console.log("websocket connection open " + clientCount)

  ws.on("close", function() {
    clientCount--;
    delete allClients[ws.id];
    console.log("websocket connection closed, total " + clientCount)
    //clearInterval(id)
  })
})

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
