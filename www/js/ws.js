
function socket(host, port, actions, listener)
{
  this.host = host;
  this.port = port;
  this.actions = actions;
  this.listenter = listener;

  this.ws = new WebSocket ('ws://' + host + ':' + port);

  this.send = function(m) {
    this.ws.send(m);
  };

  this.ws.Close = function() {
    this.ws.close();
  };

  this.ws.onerror = function(e) {
    console.error("websocket error : " + host + ':' + port + ' ' + e.message);
  };

  this.ws.onopen = function (e) {
    actions.forEach(action => {
      console.log(action);
      this.ws.send(action);
    });
  };

  this.ws.onclose = function(e) {
    console.warn('websocket closed : ' + host + ':' + port + ' reason : ' + e.reason);
  };

  this.ws.onmessage = function(e) {
    console.log(e);
    listener(e.data);
  };
}