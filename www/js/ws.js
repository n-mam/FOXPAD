
function Socket(host, port, actions, agent)
{
  this.host = host;
  this.port = port;
  this.actions = actions;
  this.agent = agent;

  this.ws = new WebSocket ('ws://' + host + ':' + port);

  this.ws.socket = this;

  this.isConnected = function(){
    return (this.ws.readyState === 1)
  }

  this.send = function(m) {
    this.ws.send(m);
  };

  this.close = function() {
    this.ws.close();
  };
  /*
   * In the below ws events, this refers to the element that received the event
   */
  this.ws.onerror = function(e) {
    this.socket.agent.onerror(e)
  };

  this.ws.onopen = function (e) {
    this.socket.agent.onopen(e);
    actions.forEach(action => {
      console.log(action);
      this.ws.send(action);
    });
  };

  this.ws.onclose = function(e) {
    this.socket.agent.onclose(e);
  };

  this.ws.onmessage = function(e) {
    this.socket.agent.onmessage(e);
  };
}