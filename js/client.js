
var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host);

moment.defaultFormat = 'MMM Do YYYY, h:mm:ss:SSS a';

var timeBefore = new moment();
document.querySelector('#serverTime').innerHTML = timeBefore.format();

ws.onmessage = function (event) {

  var serverData = JSON.parse(event.data);
  // multiple values:
  var serverTime = moment(serverData[0]);
  var clientCount = serverData[1];
  var color = serverData[2];
  
  //var li = document.createElement('li');
  //li.innerHTML = JSON.parse(event.data);

  var clientTime = moment();
  var serverTimeDiff = serverTime.diff(timeBefore) - 1000; // minus ping default time
  var clientTimeDiff = clientTime.diff(serverTime);
  var serverApprox = serverTime.add(serverTimeDiff);

  timeBefore = serverTime;

  var setColor = setTimeout(function() {
      document.body.style.backgroundColor=color;
    }, clientTimeDiff + 1000)


  document.querySelector('#clientTime').innerHTML = clientTime.format();
  document.querySelector('#serverTime').innerHTML =  serverTime.format();
  //document.querySelector('#serverApprox').innerHTML = serverApprox.format();  
  document.querySelector('#serverTimeDiff').innerHTML = serverTimeDiff;  
  document.querySelector('#clientTimeDiff').innerHTML = clientTimeDiff;  
  document.querySelector('#clientCount').innerHTML = clientCount;
  document.querySelector('#color').innerHTML = color;

};