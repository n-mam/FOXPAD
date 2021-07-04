function Camera(o)
{
  this.id = o.id;
  this.sid = o.sid;
  this.source = o.source;
  this.target = o.target;
  this.tracker = o.tracker;
  this.uid = o.uid;
  this.aid = o.aid;
  this.skipcount = o.skipcount;
  this.bbarea = o.bbarea;
  this.transport = o.transport;
  this.exhzbb = o.exhzbb;
  this.algo = o.algo;

  this.getSessions = function(){
    let cmd = {};
    cmd.app = 'cam';
    cmd.req = 'get-active-sessions';
    this.agent.send(cmd);
  }

  this.OnAgentConnect = function(){
    this.getSessions();
  }

  this.OnAgentMessage = function(res) {

    if (res.req == 'get-active-sessions')
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
      this.getSessions();
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
    else
    {
      console.log("prism : unknown agent message");
    }
  } // OnAgentMessage

  for (let i = 0; i < Agents.length; i++)
  {
    if (this.aid == Agents[i].id)
    {
      this.agent = Agents[i];
      Agents[i]['onmessage']['cam'] = this.OnAgentMessage.bind(this);
      Agents[i]['onconnect'] = this.OnAgentConnect.bind(this);
    }
  }
}

function getCameraObject(id)
{
  for (let i = 0; i < Cameras.length; i++)
  {
    if (id === Cameras[i].id)
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
    show_message("Please specify all camera parameters");
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
   },
   false,
   (res, e) => {
     if (!e)
     {
       let table = $('#id-camera-table').data('table');

       if (isDefined(id)) {
         table.deleteItem(0, id);
       }

       let values = [
        isDefined(id) ? id : res.result.insertId,
        cam.sid,
        cam.source.replace(/\\\\/g, "\\"),
        cam.target,
        cam.tracker,
        cam.aid
       ];

       table.addItem(values, true);
       location.reload(true);
     }
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
      content: CameraControlView(camera),
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

  if (!isDefined(cam.agent)) {
    show_message("Camera agent not defined");
    return;
  }

  if (!cam.agent.isConnected()){
    show_message("Camera agent not running");
    return;
  }

  let cmd = {
    app: 'cam',
    req: 'camera-control',   
    action: action,
    sid: cam.sid.toString(),
    cid: cam.id.toString(),
    aid: cam.aid.toString(),
    uid: uid.toString(),
    source: cam.source,
    target: cam.target,
    tracker: cam.tracker,
    skipcount: cam.skipcount.toString(),
    bbarea: cam.bbarea.toString(),
    transport: cam.transport,
    exhzbb: cam.exhzbb.toString(),
    algo: cam.algo,
    aep: location.hostname
  };

  cam.agent.send(cmd);

  if (action == "stop" || action === "delete") {
    setTimeout(function () {
      let canvas = document.getElementById('id-cam-canvas-' + cam.id);
      let context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
    }, 500);
  }
}

function OnCameraTableNodeClick()
{
}

function OnCameraDeleteClick()
{
  let table = $('#id-camera-table').data('table');
  let items = table.getSelectedItems();

  if (!items.length) 
  {
    show_message("Please select a camera to delete");
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
      table: 'cameras',
      where: 'id IN (' + id.toString() + ')',
      rows: [{x: 'y'}]
    },
    false,
    (res, e) => {
      if (!e)
      {
        items.forEach(element => {
          table.deleteItem(0, element[0]);
        });
        table.draw();
      }
    }
  );
}

function OnCameraAddClick()
{
  Metro.dialog.create({
    title: "New Camera",
    content: AddNewCameraView(),
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
  let table = $('#id-camera-table').data('table');
  let items = table.getSelectedItems();

  if (!items.length) {
    show_message("Please select a camera to edit");
    return;
  }

  if (items.length > 1) {
    show_message("Please select a single camera to edit");
    return;
  }

  Metro.dialog.create({
    title: `Edit : <b>${items[0][1]}</b>`,
    content: AddNewCameraView(),
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
      document.getElementById('new-cam-agent').value = items[0][5];
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

function CameraControlView(cam)
{
  let cid = cam.id;

  return `
   <script>
   var areaButton = [
    {
      html: "<span class='mif-floppy-disk'></span>",
      onclick: "OnCameraPropertySave(${cid}, 'bbarea')"
    }
   ]
   var skipCountButton = [
    {
      html: "<span class='mif-floppy-disk'></span>",
      onclick: "OnCameraPropertySave(${cid}, 'skipcount')"
    }
   ]
   </script>
   <div class="grid d-flex flex-justify-center">
    <div class="row d-flex flex-justify-center flex-align-center p-2">
      <button class="button m-1 mt-2 small outline rounded primary" onclick="OnCameraControl('${cid}', 'create');">CREATE</button>
      <button class="button m-1 mt-2 small outline rounded success" onclick="OnCameraControl('${cid}', 'start');">START</button>
      <button class="button m-1 mt-2 small outline rounded warning" onclick="OnCameraControl('${cid}', 'stop');">STOP</button>
      <button class="button m-1 mt-2 small outline rounded alert" onclick="OnCameraControl('${cid}', 'delete');">DELETE</button>      
    </div>
    <div class="row d-flex flex-justify-center flex-align-center pl-2 pr-2 text-center">
      <div class="cell-4">
        <select data-prepend="MOCAP" data-role="select" data-on-item-select="OnCameraPropertyMocapAlgoSelect">
          <option id='id-algo-mog' value="mog" data-cid="${cid}" ${cam.algo == "mog" ? 'selected' : ''}>MOG</option>
          <option id='id-algo-cnt' value="cnt" data-cid="${cid}" ${cam.algo == "cnt" ? 'selected' : ''}>CNT</option>
          <option id='id-algo-gmg' value="gmg" data-cid="${cid}" ${cam.algo == "gmg" ? 'selected' : ''}>GMG</option>
          <option id='id-algo-gsoc' value="gsoc" data-cid="${cid}" ${cam.algo == "gsoc" ? 'selected' : ''}>GSOC</option>
          <option id='id-algo-lsbp' value="lsbp" data-cid="${cid}" ${cam.algo == "lsbp" ? 'selected' : ''}>LSBP</option>
        </select>
      </div>
      <div class="cell-4">
        <select data-prepend="Transport" data-role="select" data-on-item-select="OnCameraPropertyTransportSelect">
          <option id='id-transport-tcp' value="tcp" data-cid="${cid}" ${cam.transport === "tcp" ? 'selected' : ''}>TCP</option>
          <option id='id-transport-udp' value="udp" data-cid="${cid}" ${cam.transport === "udp" ? 'selected' : ''}>UDP</option>
        </select>
      </div>
      <div class="cell-3">
        <input id='id-cam-prop-exhzbb-${cid}' type="checkbox" data-role="checkbox" data-style="2" ${cam.exhzbb ? 'checked' : ''} onclick="OnCameraPropertySave('${cid}', 'exhzbb')" data-caption="Exclude HZ-BB" data-caption-position="left">
      </div>
    </div>
    <div class="row d-flex flex-justify-center flex-align-center pl-2 pr-2 text-center">
      <div class="cell-4">
        <input id='id-cam-prop-area-${cid}' value='${cam.bbarea}' type="text" data-custom-buttons="areaButton" 
          data-role="input" data-prepend="Area" data-clear-button="false">
      </div>
      <div class="cell-3">
        <input id='id-cam-prop-skipcount-${cid}' value='${cam.skipcount}' type="text" data-custom-buttons="skipCountButton" 
          data-role="input" data-prepend="Skip" data-clear-button="false">
      </div>
    </div>
    <div class="row d-flex flex-justify-center flex-align-center p-2">
      <canvas id="id-cam-canvas-${cid}" width="600" height="300" style="border:1px dotted #e1e1e1;"> </canvas>
    </div>
    <div class="row d-flex flex-justify-center flex-align-center p-2">
      <button class="button m-1" onclick="OnCameraControl('${cid}', 'backward');"><span class="mif-backward"></span></button>
      <button class="button m-1" onclick="OnCameraControl('${cid}', 'play');"><span class="mif-play"></span></button>
      <button class="button m-1" onclick="OnCameraControl('${cid}', 'pause');"><span class="mif-pause"></span></button>
      <button class="button m-1" onclick="OnCameraControl('${cid}', 'forward');"><span class="mif-forward"></span></button>
    </div>
   </div>
   `;
}

function OnCameraPropertyMocapAlgoSelect(val, option, item) {
  let cid = $('#id-algo-' + val).data("cid");
  OnCameraPropertySave(cid, 'algo', val);
}

function OnCameraPropertyTransportSelect(val, option, item) {
  let cid = $('#id-transport-' + val).data("cid");
  OnCameraPropertySave(cid, 'transport', val);
}

function OnCameraPropertySave(cid, prop, val) {

  let cam = getCameraObject(parseInt(cid));

  let value = '';

  if (prop == 'bbarea') {
    value = $('#id-cam-prop-area-' + cid).val();
    cam[prop] = value;
  } else if (prop == 'skipcount') {
    value = $('#id-cam-prop-skipcount-' + cid).val();
    cam[prop] = value;
  } else if (prop == 'MarkBaseFrame') {
    console.log('MarkBaseFrame');
  } else if (prop == 'transport') {
    show_message("Please restart camera configuration to use " + val + " transport");
    value = val;
    cam[prop] = value;
  } else if (prop == 'exhzbb') {
    value = $('#id-cam-prop-exhzbb-' + cid).is(":checked") ? '1' : '0';
    cam[prop] = value;
  } else if (prop == 'algo') {
    value = val;
    cam[prop] = value;
  }

  if (cam.agent.isConnected())
  {
    let cmd = 
     {
       app: 'cam',
       req: 'camera-control',
       action: 'set-property',
       prop: prop,
       value: value,
       sid: cam.sid.toString()
     };

    cam.agent.send(cmd);
  }

  if (prop != 'MarkBaseFrame')
  {
    let row = {};
    row['id'] = cam.id;
    row[prop] = value;
  
    _crud(
     {
       action: 'UPDATE',
       table: 'cameras',
       rows: [row]
     }, false);
  }
}

function AddNewCameraView() {
  let o = ``;
  for (let i = 0; i < Agents.length; i++) {
    o += `<option value="${Agents[i].id}" data-template="<span class='mif-flow-tree icon'></span> $1">${Agents[i].sid}</option>`
  }
  return `
    <div class="row">
       <div class="cell-12"><input id="new-cam-name" type="text" data-role="input" data-prepend="Name"></div>
    </div>
    <div class="row">
       <div class="cell-12"><input id="new-cam-src" type="text" data-role="input" data-prepend="Source"></div>
    </div>
    <div class="row">
       <div class="cell-12">
        <select id="new-cam-target" data-prepend="Target" data-role="select">
          <option value="people" data-template="<span class='mif-users icon'></span> $1" selected="selected">People</option>
          <option value="face" data-template="<span class='mif-eye icon'></span> $1">Face Detection</option>
          <option value="fr" data-template="<span class='mif-codepen icon'></span> $1">Face Recognition</option>
          <option value="car" data-template="<span class='mif-cab icon'></span> $1">Car</option>
          <option value="mocap" data-template="<span class='mif-move-down icon'></span> $1">Motion</option>        
        </select>
       </div>
    </div>
    <div class="row">
       <div class="cell-12">
        <select id="new-cam-tracker" data-prepend="Tracker" data-role="select">
          <option value="CSRT" data-template="<span class='mif-target icon'></span> $1">CSRT</option>
        </select>
       </div>
    </div>
    <div class="row">
       <div class="cell-12">
         <select id="new-cam-agent" data-prepend="Agent" data-role="select">
          ${o}
         </select>
       </div>
    </div>
  `;
}

function InitCameraObjects()
{
  let j = JSON.parse(decodeURI(g_cameras));

  for (let i = 0; i < j.length; i++)
  {
    Cameras.push(new Camera(j[i]));
  }

  $("#id-camera-table").table();
  
  $("#id-camera-table").on("click", "td:not(.check-cell)", function() {
    let e = $(this);
    while (!e.hasClass("check-cell")) {
      e = e.prev();
    }
    OnCameraSelect(e.next().text());
  });
}

windowOnLoadCbk.push(InitCameraObjects);

var Cameras = [];