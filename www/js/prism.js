
function Agent(id, name, host, port)
{
  this.dbid = id;
  this.name = name;
 
  this.getSessions = function() {
    let cmd = {};
    cmd.app = 'cam';
    cmd.req = 'get-active-sessions';
    this.socket.send(JSON.stringify(cmd));
  };

  this.isConnected = function(){
    return this.socket.isConnected();
  }

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
    else if (isDefined(res.error))
    {
      Metro.toast.create(res.error, null, null, "alert");
    }
  }

  this.socket = new Socket(host, port, [], this);
}

function Camera(id, name, source, target, tracker, skipcount, aid)
{
  this.dbid = id;
  this.name = name;
  this.source = source;
  this.target = target;
  this.tracker = tracker;
  this.skipcount = skipcount;
  this.aid = aid;

  for (let i = 0; i < Agents.length; i++)
  {
    if (aid == Agents[i].dbid)
    {
      this.agent = Agents[i];
    }
  }
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

function getCameraObject(id)
{
  for (let i = 0; i < Cameras.length; i++)
  {
    if (id === Cameras[i].dbid)
    {
      return Cameras[i];
    }
  }
}

function OnCameraSelect(node)
{
  console.log(node[0].id);

  let camera = getCameraObject(
    parseInt(((node[0].id).split("-")).pop())
  );

  let ccid = "#" + node[0].id + "-control";

  if (!$(ccid).length)
  {
    let e = Metro.window.create({
      resizeable: true,
      draggable: true,
      width: 'auto',
      id: ccid.substr(1),
      icon: "<span class='mif-video-camera'></span>",
      title: node[0].innerText,
      content: decodeURI(cameraControl),
      place: "center",
      onShow: function(win){
        alert(camera);
      },
      onClose: function(win){
        alert('onclose');
      }
    });
  }


  // toggleCCWindowVisibility();
  // ($(".window-caption").children(".title"))[0].innerHTML = '<b>' +node[0].innerText + '</b>';

  let id = node.attr("data-value");

  for (let i = 0; i < Cameras.length; i++)
  {
    if (id == Cameras[i].dbid)
    {
      selectedCamera = Cameras[i];
    }
  }
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
  if (!isDefined(selectedCamera)){
    Metro.toast.create("Please select a camera", null, null, "alert");
    return;
  }

  if (!selectedCamera.agent.isConnected()){
    Metro.toast.create("Camera agent not running", null, null, "alert");
    return;
  }

  let cmd = {};
  cmd.app = 'cam';
  cmd.sid = selectedCamera.name;
  cmd.req = 'camera-control';
  cmd.action = action;
  selectedCamera.agent.socket.send(JSON.stringify(cmd));
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
function OnCameraSaveConfigClick()
{
  console.log('OnCameraSaveClick');
}
function OnAgentSaveConfigClick()
{
  console.log('OnAgentSaveClick');
}

function InitAgentObjects()
{
  let j = JSON.parse(g_agents);

  for (let i = 0; i < j.length; i++)
  {
    let ag = new Agent(j[i].id, j[i].name, j[i].host, j[i].port);
    Agents.push(ag);
  }
}

function InitCameraObjects()
{
  let j = JSON.parse(decodeURI(g_cameras));

  for (let i = 0; i < j.length; i++)
  {
    let cr = new Camera(j[i].id, j[i].name, j[i].source, j[i].target, j[i].tracker, j[i].skipcount, j[i].aid);
    Cameras.push(cr);
  }
}

windowOnLoadCbk.push(InitAgentObjects);
windowOnLoadCbk.push(InitCameraObjects);

var Cameras = [];
var Agents = [];

var selectedCamera;