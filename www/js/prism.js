function Agent(name, host, port)
{
  this.name = name;
 
  this.getSessions = function() {
    let cmd = {};
    cmd.app = 'cam';
    cmd.req = 'get-active-sessions';
    this.socket.send(JSON.stringify(cmd));
  };

  this.onopen = function(e){
    console.log("agent websocket open : " + this.socket.host + ':' + this.socket.port);
    this.socket.agent.getSessions();
    let lv = $('#id-agent-list');
    let items = lv.children();
    for (let i = 0; i < items.length; i++)
    {
      if (items[i].innerText === this.socket.agent.name)
      {
        lv.data('listview').del(items[i]);
      }
    }
    lv.data('listview').add(null, {
      caption: this.socket.agent.name,
      icon: `<span class=\'mif-display fg-green\'>`
    });
  }

  this.onclose = function(e){
    console.warn('agent websocket closed : ' + this.socket.host + ':' + this.socket.port + ' reason : ' + e.reason);
    let lv = $('#id-agent-list');
    let items = lv.children();
    for (let i = 0; i < items.length; i++)
    {
      if (items[i].innerText === this.socket.agent.name)
      {
        lv.data('listview').del(items[i]);
      }
    }
    lv.data('listview').add(null, {
      caption: this.socket.agent.name,
      icon: `<span class=\'mif-display fg-red\'>`
    });
  }

  this.onerror = function(e){
    console.error('agent websocket error : ' + this.socket.host + ':' + this.socket.port);
  }

  this.onmessage = function(e){

    console.log("agent websocket message : " + e.data);

    let res = JSON.parse(e.data);
  
    if (res.req == 'get-active-sessions')
    {
      let lv = $('#id-camera-list');
  
      for (let i = 0; i < res.sessions.length; i++) 
      {
        let color = 'fg-black';

        if (res.sessions[i].started == "true")
        {
          color = 'fg-green';

          if (res.sessions[i].paused == "true")
          {
            color = 'fg-amber';
          }
        }
        else
        {
          color = 'fg-red';
        }

        let items = lv.children();

        for (let i = 0; i < items.length; i++)
        {
          if (items[i].innerText === res.sessions[i].name)
          {
            lv.data('listview').del(items[i]);
          }
        }

        lv.data('listview').add(null, {
          caption: res.sessions[i].name,
          icon: `<span class=\'mif-video-camera ${color}\'>`,
          camera: res
        });
      }
    }
    else if (res.req == 'camera-create')
    {
      this.socket.agent.getSessions();
    }
    else if (res.req == 'camera-control')
    {
      this.socket.agent.getSessions();
    }
    else if (res.req == 'play')
    {
      let canvas = document.getElementById("id-cam-canvas");
      let ctx = canvas.getContext("2d");
      let image = new Image();
      image.onload = function() {
        ctx.drawImage(image, 0, 0);
      };
      image.src = "data:image/png;base64," + res.frame;
    }
  }

  this.socket = new Socket(host, port, [], this);
}

function OnCameraSaveButton()
{
  let cam = GetCameraParams();

  if (!isDefined(cam)) return;

  _crud(
   {
     action: 'CREATE',
     table: 'cameras',
     rows: [cam]
   });
}

function OnCameraStartButton()
{
  let cam = GetCameraParams();

  let cmd = {
    app: 'cam',
    req: 'camera-create',
    ...cam
  };

  socksend(cmd);

  cmd = {
    app: 'cam',
    sid: cam.name,
    req: 'camera-control',
    action: 'play'
  };

  socksend(cmd);
}

function OnCameraSelect(node)
{

}

function OnAgentSaveButton()
{
  let agent = GetAgentParams();

  if (!isDefined(agent)) return;

  _crud(
   {
     action: 'CREATE',
     table: 'agents',
     rows: [agent]
   });
}

function OnAgentSelect(node)
{
  alert("OnAgentSelect");
}

function OnCameraControl(action)
{
  let cmd = {};
  cmd.app = 'cam';
  cmd.name = 'qq'; //todo
  cmd.req = 'camera-control';
  cmd.action = action;
  socksend(cmd);
}

function GetCameraParams()
{
  let name = document.getElementById('new-cam-name').value;
  let source = document.getElementById('new-cam-src').value;
  let target = $('#new-cam-target').data('select').val();
  let trackers = $('#new-cam-tracker').data('select').val();
  let aid = $('#new-cam-agent').data('select').val();

  if (!name.length ||
      !aid.length ||
      !source.length ||
      !target.length ||
      !trackers.length) {
    Metro.toast.create("Please specify all camera parameters", null, null, "alert");
    return;
  }

  let cam = {};

  cam.name = name;
  cam.source = source.replace("\\", "\\\\");
  cam.target = target;
  cam.tracker = trackers;
  cam.aid = aid;

  return cam;
}

function GetAgentParams()
{
  let name = document.getElementById('new-agent-name').value;
  let host = document.getElementById('new-agent-host').value;
  let port = document.getElementById('new-agent-port').value;

  if (!name.length ||
      !host.length ||    
      !port.length) {
    Metro.toast.create("Please specify all agent parameters", null, null, "alert");
    return;
  }

  let agent = {};

  agent.name = name;
  agent.host = host;
  agent.port = port;

  return agent;
}

function OnAgentTableNodeClick(node)
{
  console.log('OnAgentTableNodeClick');
  var table = $('#id-agent-center-table').data('table');
  let items = table.getSelectedItems();
  console.log(items);
}
function OnCameraTableNodeClick(node)
{
  console.log('OnCameraTableNodeClick');
  var table = $('#id-camera-center-table').data('table');
  let items = table.getSelectedItems();
  console.log(items);
}
function OnCameraDeleteClick()
{
  console.log('OnCameraDeleteClick');
  var table = $('#id-camera-center-table').data('table');
  let items = table.getSelectedItems();
  console.log(items);

  if (!items.length) {
    Metro.toast.create("Please select a camera to delete", null, null, "alert");
  }

  let o = [];

  for (let i = 0; i < items.length; i++)
  {
    o.push({id: items[i][0]});  
  }

  _crud(
    {
      action: 'DELETE',
      table: 'cameras',
      rows: o
    });
}
function OnAgentDeleteClick()
{
  console.log('OnAgentDeleteClick');
  var table = $('#id-agent-center-table').data('table');
  let items = table.getSelectedItems();
  console.log(items);

  if (!items.length) {
    Metro.toast.create("Please select an agent to delete", null, null, "alert");
  }

  let o = [];

  for (let i = 0; i < items.length; i++)
  {
    o.push({id: items[i][0]});  
  }

  _crud(
    {
      action: 'DELETE',
      table: 'agents',
      rows: o
    });
}
function OnCameraAddClick()
{
  console.log('OnCameraAddClick');

  Metro.dialog.create({
    title: "New Camera",
    content: decodeURI(addCameraView),
    closeButton: true,
    actions: [
        {
            caption: "SAVE",
            cls: "js-dialog-close",
            onclick: function(){
              OnCameraSaveButton()
            }
        },
        {
            caption: "START",
            cls: "js-dialog-close",
            onclick: function(){
              OnCameraStartButton();
            }
        }
    ]
  });
}
function OnAgentAddClick()
{
  console.log('OnAgentAddClick');

  Metro.dialog.create({
    title: "New Agent",
    content: decodeURI(addAgentView),
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
function OnCameraSaveClick()
{
  console.log('OnCameraSaveClick');
}
function OnAgentSaveClick()
{
  console.log('OnAgentSaveClick');
}
function detectAgents()
{
  let j = JSON.parse(g_agents);

  for (let i = 0; i < j.length; i++)
  {
    let ag = new Agent(j[i].name, j[i].host, j[i].port);
  }
}

windowOnLoadCbk.push(detectAgents);