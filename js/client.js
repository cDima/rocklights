
var host = location.origin.replace(/^http/, 'ws')


moment.defaultFormat = 'h:mm:ss:SSS a';

//var timeBefore = new moment();
//document.querySelector('#serverTime').innerHTML = timeBefore.format();

var ws = new WebSocket(host);


function requestServerTime() {
  ws.send(JSON.stringify({ type: "get_time", client_transmit_time: Date.now()}));
}

ws.onopen = function (event) {

  // start sync
  window.kinda_ntp.init(requestServerTime);
}


ws.onmessage = function (event) {

  var serverData = JSON.parse(event.data);

  // save time to ntp for approx correction
  kinda_ntp.new_time_sync(serverData.client_transmit_time, new Date().getTime(), serverData.server_transmit_time);

  //var clientTimeDiff = (window.kinda_ntp.time_sync_correction / 100).toPrecision(3);
  var clientTimeDiff = moment(Date.now()).diff(window.kinda_ntp.time()) + "ms";
  var clientCount = serverData.clientCount;
  //var color = serverData.color;
  var synccount = (kinda_ntp.time_sync_index + 1) + "/" + kinda_ntp.time_sync_count;
  //var li = document.createElement('li');
  //li.innerHTML = JSON.parse(event.data);

  //var setColor = setTimeout(function() {
  //    document.body.style.backgroundColor=color;
  //  }, 1000)


  //document.querySelector('#serverTime').innerHTML =  serverTime.format();
  //document.querySelector('#serverApprox').innerHTML = serverApprox.format();  
  document.querySelector('#synccount').innerHTML = synccount;  
  document.querySelector('#clientTimeDiff').innerHTML = clientTimeDiff;  
  document.querySelector('#clientCount').innerHTML = clientCount;
  //document.querySelector('#color').innerHTML = color;
}

 function updateTime() {
  // multiple values:
  //var serverTime = moment(serverData.server_transmit_time);
  var clientTime = moment(window.kinda_ntp.time());
  var precision = kinda_ntp.time_precision;
  document.querySelector('#clientTime').innerHTML = clientTime.format() + " ±" + precision + "ms";
}

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var centerX = canvas.width / 2;
var centerY = canvas.height / 2;
var radius = 70;


window.setInterval(timerHit, 20);


function timerHit(){

  updateTime();

  var drawStart = new Date().getTime();

  draw();

  var drawEnd = new Date().getTime();
  var drawTime = drawEnd - drawStart;

  //document.querySelector('#drawlag').innerHTML = drawTime;
}

function getRadius(){

  var currentTime = new Date(window.kinda_ntp.time());
  // repeat every 4 secs:
  var loopSeconds = 4;
  var secondsFromLoop = currentTime.getSeconds() % loopSeconds;

  var milliseconds = ((secondsFromLoop * 1000) + currentTime.getMilliseconds());
  var animationPercent = milliseconds / (loopSeconds * 1000); 

  return canvas.width * animationPercent;

}

function draw(){

  radius = getRadius();

  clear();
  drawCircle(radius, 40, "white");

  drawCircle(Math.max(0, radius - 40), 40, "black");
  drawGrid();
  //drawCircle(radius2);
}

function clear(){
  context.beginPath();
  context.strokeStyle = "#00ff00";
  context.strokeRect(0,0, canvas.width, canvas.height);
}

function drawCircle(radius, thick, color){
  context.beginPath();
  if (radius < thick) { thick = radius; }
  context.lineWidth = thick;
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  context.strokeStyle = color;
  context.stroke();
}

function line(x0,y0,x1,y1,width){
  context.beginPath();
  context.strokeStyle = 'black';
  context.lineWidth = width;
  context.moveTo(x0, y0); 
  context.lineTo(x1,y1);
  context.closePath();
  context.stroke();
}

function drawGrid(){
  //line(0, 1, canvas.width, 6);
  for (var y = 0; y <= canvas.width; y += 4) {
    line(0, y, canvas.width, y, 2);
  }

  for (var x = 0; x <= canvas.height; x += 4) {
    line(x, 0, x, canvas.height, 2);
  }

}

