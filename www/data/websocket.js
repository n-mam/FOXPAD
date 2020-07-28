let sock = new WebSocket("ws://localhost:8081");

sock.onopen = function(e) {
  sendGetActiveSessionsCmd();
};

sock.onmessage = function(e) {

  console.log(`server : ${e.data}`);

  let res = JSON.parse(e.data);

  if (res.req == 'get-active-sessions')
  {
    var lv = $('#id-active-cameras');

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
    sendGetActiveSessionsCmd();
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
};

sock.onclose = function(e) {
  if (e.wasClean) 
  {
    console.log(`Connection closed, code=${e.code} reason=${e.reason}`);
  }
  else 
  {
    console.log('Connection died');
  }
};

sock.onerror = function(err) {
  console.log(`error : ${err.message}`);
};

function socksend(m)
{
  let s = JSON.stringify(m);
  console.log('client : ' + s);
  sock.send(s);
}

function sendGetActiveSessionsCmd()
{
  let cmd = {};
  cmd.app = 'cam';
  cmd.req = 'get-active-sessions';
  socksend(cmd);
}