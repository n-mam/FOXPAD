function Agent(o)
{
  this.id = o.id;
  this.sid = o.sid;
  this.host = o.host;
  this.port = o.port;

  this.getSessions = function() {
    let cmd = {};
    cmd.app = 'cam';
    cmd.req = 'get-active-sessions';
    this.send(cmd);
  };

  this.isConnected = function(){
    return this.socket.isConnected();
  }

  this.send = function(m){
    console.log("client : " + JSON.stringify(m))
    this.socket.send(JSON.stringify(m));
  }

  this.onopen = function(e){
    console.log("agent websocket open : " + this.socket.host + ':' + this.socket.port);
    this.socket.agent.getSessions();
    let lv = $('#id-agent-table');
    let items = lv.find("tr");
    let self = this;
    $.each(items, function() {
      let ch = $(this).children();
      if (parseInt($(ch[2]).text()) === self.socket.agent.id) {
        $(ch[3]).addClass("success text-bold border bd-gray");
      }
    });
  }

  this.onclose = function(e){
    console.warn('agent websocket closed : ' + this.socket.host + ':' + this.socket.port + ' reason : ' + e.reason);
    show_error("Agent '" + this.socket.agent.sid + "' connection broken");
    let lv = $('#id-agent-table');
    let items = lv.find("tr");
    let self = this;
    $.each(items, function() {
      let ch = $(this).children();
      if (parseInt($(ch[2]).text()) === self.socket.agent.id) {
        $(ch[3]).addClass("alert border bd-gray");
      }
    });
  }

  this.onerror = function(e){
    console.error('agent websocket error : ' + this.socket.host + ':' + this.socket.port);
  }

  this.onmessage = function(e){

    if (e.data.indexOf("\"frame\"") === -1)
    {
      console.log("agent : " + e.data);
    }

    let res = JSON.parse(e.data);

    if (isDefined(res.error))
    {
      show_error(res.error);
    }
    else if (res.req == 'get-active-sessions')
    {
      let items = $('#id-camera-table').find("tr");

      $.each(items, function() {
        let ch = $(this).children();
        $(ch[3]).clearClasses();
      });

      for (let i = 0; i < res.sessions.length; i++) 
      {
        let color = '';

        if (res.sessions[i].started == "true")
        {
          color = 'success border bd-gray';

          if (res.sessions[i].paused == "true")
          {
            color = 'warning border bd-gray';
          }
        }
        else
        {
          color = 'alert border bd-gray';
        }

        $.each(items, function() {
          let ch = $(this).children();
          if ($(ch[3]).text() === res.sessions[i].sid)
          {
            $(ch[3]).addClass(color);
          }
        });
      }
    }
    else if (res.req == 'camera-control')
    {
      this.socket.agent.getSessions();
    }
    else if (res.req == 'play')
    {
      let cam = getCameraObjectBySid(res.sid);
      let canvas = document.getElementById('id-cam-canvas-' + cam.id);

      if (canvas)
      {
        let ctx = canvas.getContext("2d");
        let image = new Image();
        image.onload = function() {
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          ctx.drawImage(image, 0, 0);
        };
        image.src = "data:image/png;base64," + res.frame;
      }
    }
  }

  this.socket = new Socket(this.host, this.port, [], this);
}

function GetAgentParams()
{
  let name = document.getElementById('new-agent-name').value;
  let host = document.getElementById('new-agent-host').value;
  let port = document.getElementById('new-agent-port').value;

  if (!isDefined(name) || !name.length ||
      !isDefined(host) || !host.length ||
      !isDefined(port) || !port.length) {
    show_error("Please specify all agent parameters");
    return;
  }

  let agent = {};
  agent.sid = name;
  agent.host = host;
  agent.port = port;

  return agent;
}
function OnAgentSaveButton(id)
{
  let agent = GetAgentParams();

  if (!isDefined(agent)) return;

  if (isDefined(id)) 
  {
    agent.id = id;
  }

  agent.uid = uid.toString();

  _crud(
   {
     action: isDefined(id) ? 'UPDATE' : 'CREATE',
     table: 'agents',
     rows: [agent]
   });
}
function OnAgentSelect(node)
{
  alert("OnAgentSelect");
}
function OnAgentTableNodeClick()
{
}
function OnAgentDeleteClick()
{
  var table = $('#id-agent-table').data('table');
  let items = table.getSelectedItems();

  if (!items.length) {
    show_error("Please select agents to delete");
    return;
  }

  let id = [];

  for (let i = 0; i < items.length; i++)
  {
    id.push(items[i][0]);
  }

  _crud(
    {
      action: 'DELETE',
      table: 'agents',
      where: 'id IN (' + id.toString() + ')',
      rows: [{x: 'y'}]
    });
}
function OnAgentAddClick()
{
  Metro.dialog.create({
    title: "New Agent",
    content: addNewAgentView(),
    closeButton: true,
    actions: [
        {
            caption: "SAVE",
            cls: "js-dialog-close",
            onclick: function(){
              OnAgentSaveButton();
            }
        },
        {
            caption: "CANCEL",
            cls: "js-dialog-close",
            onclick: function(){

            }
        }
    ]
  });
}
function OnAgentEditConfigClick()
{
  var table = $('#id-agent-table').data('table');
  let items = table.getSelectedItems();

  if (!items.length) {
    show_error("Please select an agent to edit");
    return;
  }

  if (items.length > 1) {
    show_error("Please select a single agent to edit");
    return;
  }

  Metro.dialog.create({
    title: `Edit Agent : ${items[0][1]}`,
    content: addNewAgentView(),
    closeButton: true,
    onShow: () => {
      document.getElementById('new-agent-name').value = items[0][1];
      document.getElementById('new-agent-host').value = items[0][2];
      document.getElementById('new-agent-port').value = items[0][3];
    },
    actions: [
        {
          caption: "SAVE",
          cls: "js-dialog-close",
          onclick: function(){
            OnAgentSaveButton(items[0][0]);
          }
        },
        {
          caption: "CANCEL",
          cls: "js-dialog-close",
          onclick: function(){

          }
        }
    ]
  });
}
function addNewAgentView() {
  return `
    <div class="row">
      <div class="cell-12"><input id="new-agent-name" type="text" data-role="input" data-prepend="Name"></div>
    </div>
    <div class="row">
      <div class="cell-12"><input id="new-agent-host" type="text" data-role="input" data-prepend="Host"></div>
    </div>
    <div class="row">
      <div class="cell-12"><input id="new-agent-port" type="text" data-role="input" data-prepend="Port"></div>
    </div>`;
}

function InitAgentObjects()
{
  let j = JSON.parse(g_agents);

  for (let i = 0; i < j.length; i++)
  {
    Agents.push(new Agent(j[i]));
  }
  
  $("#id-agent-table").table();

  $("#id-agent-table").on("click", "td:not(.check-cell)", function() {
    let e = $(this);
    while (!e.hasClass("check-cell")) {
      e = e.prev();
    }
    alert(e.next().text());
  });
}

windowOnLoadCbk.unshift(InitAgentObjects);

var Agents = [];