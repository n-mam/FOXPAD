var accordion = require('../common/Accordion');

let xxx = `
  <ul id="id-active-cameras"
      data-role="listview"
      data-selectable="true"
      data-on-node-click=OnCameraSelect>

  </ul>
`;

function CameraConfigView(id)
{
  return `
  <div class="cell flex-justify-center" id='${id}' style="display:none">
    <div data-role="panel" 
         data-title-caption="Panel title" 
         data-collapsible="true" 
         data-title-icon="<span class='mif-video-camera'></span>">
      <canvas id="id-cam-canvas" width="500" height="400" style="border:1px solid #dbd5d5;"> </canvas>
      <div class="d-flex flex-justify-center">
        <button class="button m-1" onclick="OnCameraControl('backward');"><span class="mif-backward"></span></button>
        <button class="button m-1" onclick="OnCameraControl('play');"><span class="mif-play"></span></button>
        <button class="button m-1" onclick="OnCameraControl('pause');"><span class="mif-pause"></span></button>
        <button class="button m-1" onclick="OnCameraControl('stop');"><span class="mif-stop"></span></button>
        <button class="button m-1" onclick="OnCameraControl('forward');"><span class="mif-forward"></span></button>
      </div>
    </div>

  </div>`;
}

function NewCameraView(id)
{
  return `
  <div class="cell flex-justify-center" id=${id} style="display:none">
  <div data-role="panel"
       data-title-caption="New Camera"
       data-title-icon="<span class='mif-apps'></span>"
       data-collapsible="true"
       data-draggable="false"
       class="text-center">
     <div class="row">
       <div class="cell-12"><input id="new-cam-name" type="text" data-role="input" data-prepend="Name"></div>
     </div>
     <div class="row">
       <div class="cell-12"><input id="new-cam-src" type="text" data-role="input" data-prepend="Source"></div>
     </div>
     <div class="row">
      <div class="cell-12">
       <select id="new-cam-target" data-prepend="Target" data-role="select">
        <option value="person" data-template="<span class='mif-users icon'></span> $1" selected="selected">People</option>
        <option value="face" data-template="<span class='mif-eye icon'></span> $1">Face</option>
        <option value="car" data-template="<span class='mif-truck icon'></span> $1">Car</option>
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
     <div class="row d-flex flex-justify-center">
        <button class="button m-1 w-25" onclick="OnCameraStartButton()">START</button>
        <button class="button m-1 w-25" onclick="OnCameraSaveButton()">SAVE</button>
     </div>
  </div>
</div>
  `;
}

function AlertsView()
{
  return ``;
}

function ReportsView()
{
  return ``;
}

function AgentsView(id)
{
  return `
    <div id='${id}' style='display:none'>
    <div class="cell-7">
     <div class='input-control text'>
       <input id='${id}-node-ip' style='text-align:center;' type="text" class="flex" placeholder='IP' data-role="input" data-clear-button="false">
     </div>
    </div>
    <div class="cell-3">
     <div class="input-control text">
       <input id='${id}-node-port' style='text-align:center;' type="text" class="flex" placeholder='PORT' data-role="input" data-clear-button="false">
     </div>
    </div>
    <div class="cell-2">
     <button class="button primary outline">Add</button>
    </div>
   </div>
  `;
}

function render(v, id)
{
  let sections = [];

  sections.push(
    {
      title : 'CAMERAS',
      link : 'id-camera',
      content : xxx
    });

  sections.push(
    {
      title : 'AGENTS',
      link : 'id-agents',
      content : ''
    });

  sections.push(
    {
      title : 'ALERTS',
      link : 'id-alerts',
      content : ''      
    });

  sections.push(
    {
      title : 'REPORTS',
      link : 'id-reports',
      content : ''
    });

  v.page.html.left.push(accordion.render('', sections));

  v.page.html.center.push(CameraConfigView('id-camera-center'));
  v.page.html.right.push(NewCameraView('id-camera-right'));
  
  v.page.html.center.push(AgentsView('id-agents'));
  v.page.html.center.push(AlertsView('id-alerts'));
  v.page.html.center.push(ReportsView('id-reports'));
}

module.exports = { render }