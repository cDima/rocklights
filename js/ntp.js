
(function(root) {
  
  var kinda_ntp = {};
  var time_sync_interval = 500;
  var time_sync_count = 10;
  kinda_ntp.time_sync_index = 0; // global var
  var time_sync_array = new Array();
  kinda_ntp.time_sync_correction = 0;
  
  var iosocket = null;
  var interval_handle = null;
  var requestServerTime = null; // call back to socket ws
  
  kinda_ntp.new_time_sync = function(client_transmit_time, client_receive_time, server_transmit_time) {
    time_sync_array[kinda_ntp.time_sync_index++] = (1 / 2) * (client_receive_time - client_transmit_time);
      
    delay_total = 0;
    for(i = 0; i < kinda_ntp.time_sync_index; i++) {
      if(time_sync_array[i] != null)
        delay_total += time_sync_array[i];
      else
        break;
    }
    kinda_ntp.time_sync_correction = ((delay_total / i) + server_transmit_time) - client_receive_time;
  };
  
  kinda_ntp.resync = function() {
    interval_handle = setInterval(function() {
      if(kinda_ntp.time_sync_index < (time_sync_count - 1))
        this.requestServerTime();
      else
        clearInterval(interval_handle);
    }, time_sync_interval);
  };
  
  kinda_ntp.init = function(requestServerTime) {
    time_sync_interval = time_sync_interval;
    time_sync_count = time_sync_count;
    this.requestServerTime = requestServerTime;
    //iosocket.on('kinda:time', function(data) {
    //  new_time_sync(data.client_transmit_time, new Date().getTime(), data.server_transmit_time);
    //});
    
    kinda_ntp.resync();
  };
  
  kinda_ntp.time = function get_time() {
    return Date.now() + kinda_ntp.time_sync_correction;
  }
  
  if(typeof define === 'function' && define.amd) {
    define('kinda_ntp', [], function() {
      return kinda_ntp;
    });
  }
  else
    root.kinda_ntp = kinda_ntp;

})(window);