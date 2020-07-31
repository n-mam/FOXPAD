function agent(name, host, port)
{
  this.name = name;

  this.sock = new socket(host, port, {}, this.OnMessage)
 
  this.getActiveSessions = function() {
    let cmd = {};
    cmd.app = 'cam';
    cmd.req = 'get-active-sessions';
    this.sock.send(cmd);
  };

  this.OnMessage = function(m) {

    console.log(`server : ${e.data}`);

    let res = JSON.parse(e.data);
  
    if (res.req == 'get-active-sessions')
    {
      var lv = $('#id-camera-list');
  
      lv.empty();
  
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
  
        lv.data('listview').add(null, {
          caption: res.sessions[i].sid,
          icon: `<span class=\'mif-video-camera ${color}\'>`,
          camera: res
        });
      }
    }
    else if (res.req == 'camera-create')
    {
      var lv = $('#id-active-cameras');
  
      lv.data('listview').add(null, {
        caption: res.sid,
        icon: '<span class=\'mif-video-camera fg-black\'>'
      });
    }
    else if (res.req == 'camera-control')
    {
      getActiveSessions();
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
    sid: cam.sid,
    req: 'camera-control',
    action: 'play'
  };

  socksend(cmd);
}

function OnCameraSelect(node)
{
  alert("OnCameraSelect");
}

function OnAgentSelect(node)
{
  alert("OnAgentSelect");
}

function OnCameraControl(action)
{
  let cmd = {};
  cmd.app = 'cam';
  cmd.sid = 'qq'; //todo
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
      !agent.length ||    
      !source.length ||
      !target.length ||
      !trackers.length) {
    Metro.toast.create("Please specify all camera parameters", null, null, "alert");
    return;
  }

  let cam = {};

  cam.name = name;
  cam.source = source;
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