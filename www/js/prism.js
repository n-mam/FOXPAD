function Agent(id, sid, host, port)
{
  this.dbid = id;
  this.sid = sid;
 
  this.getSessions = function() {
    let cmd = {};
    cmd.app = 'cam';
    cmd.req = 'get-active-sessions';
    this.socket.send(JSON.stringify(cmd));
  };

  this.isConnected = function(){
    return this.socket.isConnected();
  }

  this.send = function(m){
    console.log("agent : " + JSON.stringify(m))
    this.socket.send(JSON.stringify(m));
  }

  this.onopen = function(e){
    console.log("agent websocket open : " + this.socket.host + ':' + this.socket.port);
    this.socket.agent.getSessions();
    let lv = $('#id-agent-right-table');
    let items = lv.find("tr");
    let self = this;
    $.each(items, function() {
      let ch = $(this).children();
      if (parseInt($(ch[2]).text()) === self.socket.agent.dbid) {
        $(ch[3]).addClass("success border bd-gray");
      }
    });
  }

  this.onclose = function(e){
    console.warn('agent websocket closed : ' + this.socket.host + ':' + this.socket.port + ' reason : ' + e.reason);
    show_error("Agent '" + this.socket.agent.sid + "' connection broken");
    let lv = $('#id-agent-right-table');
    let items = lv.find("tr");
    let self = this;
    $.each(items, function() {
      let ch = $(this).children();
      if (parseInt($(ch[2]).text()) === self.socket.agent.dbid) {
        $(ch[3]).addClass("alert border bd-gray");
      }
    });
  }

  this.onerror = function(e){
    console.error('agent websocket error : ' + this.socket.host + ':' + this.socket.port);
  }

  this.onmessage = function(e){

    console.log("server : " + e.data);

    let res = JSON.parse(e.data);

    if (res.req == 'get-active-sessions')
    {
      let items = $('#id-camera-right-table').find("tr");

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
      let canvas = document.getElementById('id-cam-canvas-' + cam.dbid);

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
    else if (isDefined(res.error))
    {
      show_error(res.error);
    }
  }

  this.socket = new Socket(host, port, [], this);
}

function Camera(id, sid, source, target, tracker, skipcount, aid)
{
  this.dbid = id;
  this.sid = sid;
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
function getCameraObjectBySid(sid)
{
  for (let i = 0; i < Cameras.length; i++)
  {
    if (sid === Cameras[i].sid)
    {
      return Cameras[i];
    }
  }
}
function GetCameraParams()
{
  let name = document.getElementById('new-cam-name').value;
  let source = document.getElementById('new-cam-src').value;
  let target = $('#new-cam-target').data('select').val();
  let trackers = $('#new-cam-tracker').data('select').val();
  let aid = $('#new-cam-agent').data('select').val();

  if (!isDefined(name) || !name.length ||
      !isDefined(aid) || !aid.length ||
      !isDefined(source) || !source.length ||
      !isDefined(target) || !target.length ||
      !isDefined(trackers) || !trackers.length) {
    show_error("Please specify all camera parameters");
    return;
  }

  let cam = {};

  cam.sid = name;
  cam.source = source.replace(/\\/g, "\\\\");
  cam.target = target;
  cam.tracker = trackers;
  cam.aid = aid;

  return cam;
}
function OnCameraSaveButton(id)
{
  let cam = GetCameraParams();

  if (!isDefined(cam)) return;

  if (isDefined(id)) 
  {
    cam.id = id;
  }

  cam.uid = uid.toString();

  _crud(
   {
     action: isDefined(id) ? 'UPDATE': 'CREATE',
     table: 'cameras',
     rows: [cam]
   });
}
function OnCameraSelect(cid)
{
  let camera = getCameraObject(parseInt(cid));

  let ccid = "#cam-" + cid + "-control";

  if (!$(ccid).length)
  {
    Metro.window.create({
      resizeable: true,
      draggable: true,
      width: 'auto',
      btnMin: false,
      btnMax: false,
      id: ccid.substr(1),
      icon: "<span class='mif-video-camera'></span>",
      title: camera.sid,
      content: CameraControlView(cid),
      place: "center",
      onShow: function(w) {

      },
      onClose: function(w) {
        OnCameraControl(cid, 'stop-play');
      }
    });
    return true;
  }

  return true;
}
function OnCameraControl(cid, action)
{
  let cam = getCameraObject(parseInt(cid));

  if (!cam.agent.isConnected()){
    Metro.toast.create("Camera agent not running", null, null, "alert");
    return;
  }

  let cmd = {
    app: 'cam',
    req: 'camera-control',   
    action: action,
    sid: cam.sid.toString(),
    cid: cam.dbid.toString(),
    aid: cam.aid.toString(),
    uid: uid.toString(),
    source: cam.source,
    target: cam.target,
    tracker: cam.tracker,
    skipcount: cam.skipcount
  };

  cam.agent.send(cmd);
}
function OnCameraTableNodeClick()
{

}
function OnCameraDeleteClick()
{
  var table = $('#id-camera-right-table').data('table');
  let items = table.getSelectedItems();
  if (!items.length) {
    show_error("Please select a camera to delete");
    return;
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
function OnCameraAddClick()
{
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
            caption: "CANCEL",
            cls: "js-dialog-close",
            onclick: function(){
              
            }
        }
    ]
  });
}
function OnCameraEditConfigClick()
{
  var table = $('#id-camera-right-table').data('table');
  let items = table.getSelectedItems();

  if (!items.length) {
    show_error("Please select a camera to Edit");
    return;
  }

  if (items.length > 1) {
    show_error("Please select a single camera to edit");
    return;
  }

  Metro.dialog.create({
    title: `Edit : <b>${items[0][1]}</b>`,
    content: decodeURI(addCameraView),
    closeButton: true,
    onShow: () => {
      document.getElementById('new-cam-name').value = items[0][1];
      let source = items[0][2];
      if (source.startsWith("<div")) {
        document.getElementById('new-cam-src').value = 
          source.substring(source.indexOf(">") + 1, source.lastIndexOf("<"));
      } else {
        document.getElementById('new-cam-src').value = source;
      }
      document.getElementById('new-cam-target').value = items[0][3];
      document.getElementById('new-cam-tracker').value = items[0][4];
      //5 skip count
      document.getElementById('new-cam-agent').value = items[0][6];
    },
    actions: [
      {
        caption: "SAVE",
        cls: "js-dialog-close",
        onclick: function(){
          OnCameraSaveButton(items[0][0])
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
function CameraControlView(id)
{
  return `
   <div class="grid d-flex flex-justify-center">
    <div class="row d-flex flex-justify-center p-2">
      <button class="button m-1 mt-2 small outline rounded primary" onclick="OnCameraControl('${id}', 'create');">CREATE</button>
      <button class="button m-1 mt-2 small outline rounded success" onclick="OnCameraControl('${id}', 'start');">START</button>
      <button class="button m-1 mt-2 small outline rounded warning" onclick="OnCameraControl('${id}', 'stop');">STOP</button>
      <button class="button m-1 mt-2 small outline rounded alert" onclick="OnCameraControl('${id}', 'delete');">DELETE</button>      
    </div>
    <div class="row p-2">
      <canvas id="id-cam-canvas-${id}" width="400" height="200" style="border:1px dotted #e1e1e1;"> </canvas>
    </div>
    <div class="row d-flex flex-justify-center p-2">
      <button class="button m-1" onclick="OnCameraControl('${id}', 'backward');"><span class="mif-backward"></span></button>
      <button class="button m-1" onclick="OnCameraControl('${id}', 'play');"><span class="mif-play"></span></button>
      <button class="button m-1" onclick="OnCameraControl('${id}', 'pause');"><span class="mif-pause"></span></button>
      <button class="button m-1" onclick="OnCameraControl('${id}', 'forward');"><span class="mif-forward"></span></button>
    </div>
   </div>`;
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
  var table = $('#id-agent-right-table').data('table');
  let items = table.getSelectedItems();

  if (!items.length) {
    show_error("Please select agents to delete");
    return;
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
  var table = $('#id-agent-right-table').data('table');
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

function dateFromOffset(off) {
  return new Date((new Date()).getTime() - off*24*60*60*1000);
}
function dateFromHourOffset(off) {
  return new Date((new Date()).getTime() - off*60*60*1000);
}
function dateToMySql(d) {
  return d.getFullYear() + '-' + (parseInt(d.getMonth()) + 1) + '-' + d.getDate() + " " + 
  d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
}

function Report(cid)
{
  this.cid = cid;
  this.paths = [];

  this.analyze = function(inv){

    let range = {};
    let now = new Date();

    if (inv == '1Hour') {
      /** 60 mins back from now */
      range.start = dateFromHourOffset(1);
      range.end = dateFromOffset(0);
    } else if (inv == 'Today') {
      /**  9 from today morning to 11 midnight, today */
      range.start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9);
      range.end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 59,59);
    } else if (inv == 'Daily') {
      /** 14 days earlier from today */
      range.start = dateFromOffset(13);
      range.start.setHours(0);
      range.start.setMinutes(0);
      range.start.setSeconds(0);
      range.end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    } else if (inv == 'Monthly') {
      range.start = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
      range.end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    }

    this.getIntervalData(inv, range)
  }

  this.getIntervalData = function(inv, range){
    _crud(
      {
        action: 'READ',
        columns: 'cid, aid, ts, ST_AsText(path)',
        table: 'Trails',
        where: `cid = ${this.cid} and uid = ${uid} and ts between '${dateToMySql(range.start)}' and '${dateToMySql(range.end)}'`,
        rows: [{x: 'y'}]
      }, "", (res, e) => {
        if (!e)
        {
          if (this.processIntervalData(res, inv, range))
          {
            let maxHSteps = computeHorizontalMaxima(this.paths, false);
            let maxVSteps = computeVerticalMaxima(this.paths, false);

            let ref = {};

            if (maxHSteps.length > maxVSteps.length) {
              ref.x = 0;
              ref.y = (maxHSteps[0].y + maxHSteps[maxHSteps.length-1].y) / 2;
              ref.dir = 'horizontal';
            } else {
              ref.x = (maxVSteps[0].x + maxVSteps[maxVSteps.length-1].x) / 2;
              ref.y = 0;
              ref.dir = 'vertical';
            }

            displayIntervalGraph(ref, this.paths, inv, range);

            this.showPathAnalyzerCanvas(ref, this.paths, inv, range);
          }
        }
      });
  }

  this.processIntervalData = function(res, inv, range) {

    if (!res.result.length) {
      Metro.toast.create("No data found for the selected camera and interval", null, null, "alert");
      return false;
    }

    for (let i = 0; i < res.result.length; i++) 
    {
      let p = {};
      
      p.trail = (res.result[i]['ST_AsText(path)']).replace(/MULTIPOINT/gi, "").replace(/\(/gi, "").replace(/\)/gi, "").split(",");

      p.ts = (res.result[i]).ts;

      let diff = Math.abs((new Date(p.ts)).getTime() - range.start.getTime());

      if (inv === "1Hour")
      {
        p.bucket = Math.ceil(diff / (1000 * 60 * 5)); // 5min buckets 
      }
      else if (inv === 'Today')
      {
        p.bucket = Math.ceil(diff / (1000 * 60 * 60)); // hour buckets 
      }
      else if (inv === 'Daily')
      {
        p.bucket = Math.ceil(diff / (1000 * 60 * 60 * 24)); // days bucket
      }
      else if (inv === 'Monthly')
      {
        p.bucket = Math.ceil(diff / (1000 * 60 * 60 * 24 * 30.43685)); // month bucket
      }

      this.paths.push(p);
    }

    return true;
  }

  this.showPathAnalyzerCanvas = function(ref, paths, inv, range){
    let newref;
    Metro.window.create({
      resizeable: true,
      draggable: true,
      width: 'auto',
      btnMin: false,
      btnMax: false,
      id: 'id-analyzer-win',
      icon: "<span class='mif-chart-dots'></span>",
      title: "Trail Analyzer",
      content: '<canvas id="id-trail-analyzer" width="600" height="400" style="border:1px dotted grey" ></canvas>',
      place: "right",
      onShow: function(w)
      {
        let canvas = document.getElementById("id-trail-analyzer");
        canvas.addEventListener("click", function(e){
          newref = getMousePosition("id-trail-analyzer", e);
          let counts = computeRefLineIntersectionsCount(newref, paths);
          drawRefrenceLineAndCounts(newref, counts);
        }, false);
        renderPaths("id-trail-analyzer", paths);
        if (ref.dir === 'horizontal') {
          computeHorizontalMaxima(paths, true);
        } else {
          computeVerticalMaxima(paths, true);
        }
      },
      onClose: function(w)
      {
        if (isDefined(newref))
        {
          displayIntervalGraph(newref, paths, inv, range);
        }
      }
    });
  }
}
function computeHorizontalMaxima(paths, draw) 
{
  let ref = { x: 5, y: 5 };
  let steps = [];
  let max = 0;

  while (ref.y <= 400)
  {
    let counts = computeRefLineIntersectionsCount(ref, paths);

    if ((counts.up + counts.down) > max) 
    {
      max = counts.up + counts.down;
    }

    if (draw) 
    {
      drawRefrenceLineAndCounts(ref, counts);
    }

    steps.push({counts: counts, x: ref.x, y: ref.y});

    ref.y += 20;
  }

  for (let i = steps.length - 1; i >= 0; i--)
  {
    let step = steps[i];

    if((step.counts.up + step.counts.down) != max)
    {
      steps.splice(i, 1);
    }
  }

  let yMid = (steps[0].y + steps[steps.length-1].y) / 2;

  if (draw)
  {
    let canvas = document.getElementById("id-trail-analyzer");
    let context = canvas.getContext('2d');
  
    context.beginPath();
    context.strokeStyle = "#FF0000";
    context.lineWidth = 1;
    context.setLineDash([5, 3]);
    context.moveTo(steps[0].x, steps[0].y);
    context.lineTo(canvas.width, steps[0].y);
    context.stroke();
  
    context.beginPath();
    context.strokeStyle = "#FF0000";
    context.lineWidth = 1;
    context.setLineDash([5, 3]);
    context.moveTo(steps[steps.length-1].x, steps[steps.length-1].y);
    context.lineTo(canvas.width, steps[steps.length-1].y);
    context.stroke();
  
    context.beginPath();
    context.strokeStyle = "#196F3D";
    context.lineWidth = 1;
    context.moveTo(steps[0].x, yMid);
    context.lineTo(canvas.width, yMid);
    context.stroke();
  }

  return steps; 
}
function computeVerticalMaxima(paths, draw) 
{
  let ref = { x: 5, y: 5 };
  let steps = [];
  let max = 0;

  while (ref.x <= 600)
  {
    let counts = computeRefLineIntersectionsCount(ref, paths);

    if ((counts.left + counts.right) > max) 
    {
      max = counts.left + counts.right;
    }

    if (draw) 
    {
      drawRefrenceLineAndCounts(ref, counts);
    }

    steps.push({counts: counts, x: ref.x, y: ref.y});

    ref.x += 20;
  }

  for (let i = steps.length - 1; i >= 0; i--)
  {
    let step = steps[i];

    if((step.counts.left + step.counts.right) != max)
    {
      steps.splice(i, 1);
    }
  }

  let xMid = (steps[0].x + steps[steps.length-1].x) / 2;

  if (draw)
  {
    let canvas = document.getElementById("id-trail-analyzer");
    let context = canvas.getContext('2d');
  
    context.beginPath();
    context.strokeStyle = "#FF0000";
    context.lineWidth = 1;
    context.setLineDash([5, 3]);
    context.moveTo(steps[0].x, 0);
    context.lineTo(steps[0].x, canvas.height);
    context.stroke();
  
    context.beginPath();
    context.strokeStyle = "#FF0000";
    context.lineWidth = 1;
    context.setLineDash([5, 3]);
    context.moveTo(steps[steps.length-1].x, 0);
    context.lineTo(steps[steps.length-1].x, canvas.height);
    context.stroke();
  
    context.beginPath();
    context.strokeStyle = "#196F3D";
    context.lineWidth = 1;
    context.moveTo(xMid, 0);
    context.lineTo(xMid, canvas.height);
    context.stroke();
  }

  return steps;
}
function getMousePosition(id, e) {
  let canvas = document.getElementById(id);
  let rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}
function computeRefLineIntersectionsCount(ref, paths)
{
  let counts = {up: 0, down: 0, left: 0,  right: 0};

  for (let i = 0; i < paths.length; i++)
  {
    let points = paths[i].trail;

    if (points.length > 20)
    {
      let sp = points[0].split(" ");
      let ep = points[points.length - 1].split(" ");

      //horizontal ref line
      if ((sp[1] < ref.y) && (ep[1] >= ref.y))
      {
        counts.down++;
      }
      else if ((sp[1] > ref.y) && (ep[1] <= ref.y))
      {
        counts.up++;
      }
      //vertical ref line
      if ((sp[0] < ref.x) && (ep[0] >= ref.x))
      {
        counts.right++;
      }
      else if ((sp[0] > ref.x) && (ep[0] <= ref.x))
      {
        counts.left++;
      }
    }
  }

  return counts;
}
function drawRefrenceLineAndCounts(pos, counts)
{
  let canvas = document.getElementById("id-trail-analyzer");
  let context = canvas.getContext('2d');

  context.font = '10pt Calibri';
  context.fillStyle = 'black';
  context.fillText(" u: " + counts.up + " d: " + counts.down + " l: " + counts.left + " r: " + counts.right, pos.x + 5, pos.y -5);

  //draw v ref line 
  context.beginPath();         
  context.strokeStyle = "#BFC9CA";
  context.lineWidth = 1;
  context.setLineDash([5, 3]);
  context.moveTo(pos.x, 0);
  context.lineTo(pos.x, canvas.height);
  context.stroke();
  //draw h ref line
  context.beginPath();
  context.strokeStyle = "#BFC9CA";
  context.lineWidth = 1;
  context.setLineDash([5, 3]);
  context.moveTo(0, pos.y);
  context.lineTo(canvas.width, pos.y);
  context.stroke();
}
function renderPaths(id, paths)
{
  canvas = document.getElementById(id);
  let context = canvas.getContext("2d");

  for (let i = 0; i < paths.length; i++)
  {
    let points = paths[i].trail;

    if (points.length > 20)
    {
      // draw path
      context.beginPath();
      context.strokeStyle = "#000000";

      for (let j = 0; j < points.length; j++)
      {
        let cords = points[j].split(" ");
        context.fillStyle = "#5b5b5b";
        context.fillRect(cords[0], cords[1], 1, 1);
      }

      let sp = points[0].split(" ");
      let ep = points[points.length - 1].split(" ");
      // draw start-end displacement
      context.beginPath();
      context.moveTo(sp[0], sp[1]);
      context.lineTo(ep[0], ep[1]);
      context.strokeStyle = "#00b0ff";
      context.stroke();
      // draw end point red square
      context.beginPath();
      context.fillStyle = "#FF0000";
      context.fillRect(ep[0], ep[1], 5, 5);
    }
  }
}
function displayIntervalGraph(ref, paths, inv, range)
{
  let xAxis = [];

  while (reportchart.data.labels.length)
  {
    reportchart.data.labels.pop();
  }

  reportchart.data.datasets[0].data = [];
  reportchart.data.datasets[1].data = [];

  if (inv === '1Hour')
  {
    reportchart.data.labels = [
      '5m', '10m','15m','20m','25m','30m',
      '35m','40m','45m','50m','55m','60m'];
      reportchart.options.scales.xAxes[0].scaleLabel.labelString = 'Last 1 hour'
  }
  else if (inv === 'Today')
  {
    reportchart.data.labels = [
      '9','10','11','12','13',
      '14','15','16','17','18','19','20','21','22','23'];
    reportchart.options.scales.xAxes[0].scaleLabel.labelString = 'Active hours'
  }
  else if (inv === 'Daily') 
  {
    for (let i = 0; i < 14; i++) 
    {
      let d = new Date(range.start.getTime() + i*86400000);
      
      xAxis[i] = d.getDate() + '/' + parseInt(d.getMonth() + 1);

      reportchart.data.labels = xAxis;
    }
    reportchart.options.scales.xAxes[0].scaleLabel.labelString = 'Last 14 days'
  }
  else if (inv === "Monthly")
  {
    reportchart.data.labels = [
      'Jan','Feb','Mar','Apr','May',
      'Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    reportchart.options.scales.xAxes[0].scaleLabel.labelString = (new Date()).getFullYear();
  }

  for (let i = 1; i <= reportchart.data.labels.length; i++)
  {
    let bucketPaths = [];
      
    for (let j = 0; j < paths.length; j++)
    {
      let p = paths[j];

      if (p.bucket === i)
      {
        bucketPaths.push(p);
      }
    }

    let bucketCounts = {up: 0, down: 0, left: 0,  right: 0};

    if (bucketPaths.length)
    {
      bucketCounts = computeRefLineIntersectionsCount(ref, bucketPaths);
    }

    if (ref.dir === 'horizontal')
    {
      reportchart.data.datasets[0].label = 'UP';
      reportchart.data.datasets[1].label = 'DOWN';
      reportchart.data.datasets[0].data.push(bucketCounts.up);
      reportchart.data.datasets[1].data.push(bucketCounts.down);
    }
    else if (ref.dir === 'vertical')
    {
      reportchart.data.datasets[0].label = 'LEFT';
      reportchart.data.datasets[1].label = 'RIGHT';
      reportchart.data.datasets[0].data.push(bucketCounts.left);
      reportchart.data.datasets[1].data.push(bucketCounts.right);
    }

  }

  reportchart.update();

  document.getElementById('id-chart-canvas').style = "display:flex";
}
function OnClickAnalyzeTrail()
{
  let cid = $('#id-report-cam').data('select').val();
  let inv = $('#id-report-int').data('select').val();

  if (!isDefined(cid) || 
      !isDefined(inv)) {
    show_error("Please select the camera and an interval");
    return;
  }

  let report = new Report(cid);

  report.analyze(inv);
}

function InitAgentObjects()
{
  let j = JSON.parse(g_agents);

  for (let i = 0; i < j.length; i++)
  {
    let ag = new Agent(j[i].id, j[i].sid, j[i].host, j[i].port);
    Agents.push(ag);
  }
  $("#id-agent-right-table").table();
  $("#id-agent-right-table").on("click", "td:not(.check-cell)", function() {
    let e = $(this);
    while (!e.hasClass("check-cell")) {
      e = e.prev();
    }
    alert(e.next().text());
  });
}
function InitCameraObjects()
{
  let j = JSON.parse(decodeURI(g_cameras));

  for (let i = 0; i < j.length; i++)
  {
    let cr = new Camera(j[i].id, j[i].sid, j[i].source, j[i].target, j[i].tracker, j[i].skipcount, j[i].aid);
    Cameras.push(cr);
  }
  $("#id-camera-right-table").table();
  $("#id-camera-right-table").on("click", "td:not(.check-cell)", function() {
    let e = $(this);
    while (!e.hasClass("check-cell")) {
      e = e.prev();
    }
    OnCameraSelect(e.next().text());
  });
}

windowOnLoadCbk.push(InitAgentObjects);
windowOnLoadCbk.push(InitCameraObjects);

var Cameras = [];
var Agents = [];