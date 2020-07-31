var accordion = require('../common/Accordion');

function renderList(list, id, handler) 
{
  let h = ``;

  for (let i = 0; i < list.length; i++)
  {
    h += `<li data-icon="<span class='mif-display'>" data-value="${list[i].id}" data-caption="${list[i].name}"></li>`
  }

  return `
  <ul id="${id}"
      class="p-2"
      data-role="listview"
      data-on-node-click=${handler}>
    ${h}
  </ul>`;
}

function renderSelect(options, id, title)
{
  let h = ``;

  for (let i = 0; i < options.length; i++)
  {
    h += `<option value="${options[i].id}" data-template="<span class='mif-display icon'></span> $1">${options[i].name}</option>`
  }

  return `
  <select id="${id}" data-prepend="${title}" data-role="select">
    ${h}
  </select>`;
}

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

function NewCameraView(id, agents)
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
        <option value="car" data-template="<span class='mif-cab icon'></span> $1">Car</option>
        <option value="motion" data-template="<span class='mif-move-down icon'></span> $1">Motion</option>        
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
        ${renderSelect(agents, 'new-cam-agent', 'Agent')}
      </div>
     </div>     
     <div class="row d-flex flex-justify-center">
       <button class="button m-1 w-25" onclick="OnCameraStartButton()">START</button>
       <button class="button m-1 w-25" onclick="OnCameraSaveButton()">SAVE</button>
     </div>
  </div>
</div>`;
}

function AlertsView()
{
  return ``;
}

function ReportsView()
{
  return ``;
}

function AgentConfigView(id)
{
  return ``;
}

function NewAgentView(id)
{
  return `
  <div class="cell flex-justify-center" id=${id} style="display:none">
  <div data-role="panel"
       data-title-caption="New Agent"
       data-title-icon="<span class='mif-apps'></span>"
       data-collapsible="true"
       data-draggable="false"
       class="text-center">
     <div class="row">
       <div class="cell-12"><input id="new-agent-name" type="text" data-role="input" data-prepend="Name"></div>
     </div>
     <div class="row">
       <div class="cell-12"><input id="new-agent-host" type="text" data-role="input" data-prepend="Host"></div>
     </div>
     <div class="row">
       <div class="cell-12"><input id="new-agent-port" type="text" data-role="input" data-prepend="Port"></div>
     </div>
     <div class="row d-flex flex-justify-center">
       <button class="button m-1 w-25" onclick="OnAgentSaveButton()">SAVE</button>
     </div>
  </div>
</div>`;
}

function render(v, id)
{
  let sections = [];

  sections.push(
    {
      title : 'CAMERAS',
      link : 'id-camera',
      content : renderList(v.data.cameras, 'id-camera-list', 'OnCameraSelect')
    });

  sections.push(
    {
      title : 'AGENTS',
      link : 'id-agent',
      content : renderList(v.data.agents, 'id-agent-list', 'OnAgentSelect')
    });

  sections.push(
    {
      title : 'ALERTS',
      link : 'id-alert',
      content : ''      
    });

  sections.push(
    {
      title : 'REPORTS',
      link : 'id-report',
      content : ''
    });

  v.page.html.left.push(accordion.render('', sections));

  v.page.html.center.push(CameraConfigView('id-camera-center'));
  v.page.html.right.push(NewCameraView('id-camera-right', v.data.agents));
  
  v.page.html.center.push(AgentConfigView('id-agent-center'));
  v.page.html.right.push(NewAgentView('id-agent-right'));

  v.page.html.center.push(AlertsView('id-alerts'));

  v.page.html.center.push(ReportsView('id-reports'));

  v.page.html.center.push(`<script src='/js/prism.js'></script>`);  
}

module.exports = { render }