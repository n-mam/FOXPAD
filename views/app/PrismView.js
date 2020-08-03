var accordion = require('../common/Accordion');

function renderList(list, id, handler, icon) 
{
  let h = ``;

  for (let i = 0; i < list.length; i++)
  {
    h += `<li id="${'id-cam-li-' + list[i].id}" data-icon="<span class='${icon} fg-black'>" data-value="${list[i].id}" data-caption="${list[i].sid}"></li>`
  }

  return `
   <ul id="${id}"
       class="p-3"
       data-role="listview"
       data-on-node-click=${handler}>
     ${h}
   </ul>`;
}

function renderSelect(options, id, title, icon)
{
  let h = ``;

  for (let i = 0; i < options.length; i++)
  {
    h += `<option value="${options[i].id}" data-template="<span class='${icon} icon'></span> $1">${options[i].sid}</option>`
  }

  return `
  <select id="${id}" data-prepend="${title}" data-role="select">
    ${h}
  </select>`;
}

function renderTH(columnNames)
{
  let h = ``;
  
  for (let i = 0; i < columnNames.length; i++)
  {
    h += `<th>${columnNames[i]}</th>`;
  }

  return h;
}

function renderTD(rows, keys)
{
  let h = ``;

  for (let i = 0; i < rows.length; i++)
  {
    h += `<tr>`

    for (let j = 0; j < keys.length; j++)
    {
      h += `<td contenteditable="true">${rows[i][keys[j]]}</td>`;
    }

    h += `</tr>`
  }

  return h;
};

function renderTableView(id, rows, columnNames, handler)
{
  return `
  <div class="cell flex-justify-center" id='${id}' style="display:none">

   <div class="grid">

     <div class="row">
     <table
      data-role="table" data-static-view="true"
      data-cls-table-top="row flex-nowrap"
      data-on-check-click="${'On' + handler + 'TableNodeClick()'}"
      data-cls-search="cell-md-8"
      data-cls-rows-count="cell-md-4" 
      data-pagination-wrapper=".my-pagination-wrapper"
      data-rows="5"
      data-check="true"
      data-rows-steps="5, 10"
      data-show-activity="false"
      id=${id + '-table'}
      class="table text-left striped table-border">

      <thead>
       ${renderTH(columnNames)}
      </thead>
      <tbody>
        ${renderTD(rows, columnNames)}
      </tbody>
     </table>
     </div>
     <div class="row">
       <style> .pagination {margin:0em} </style>
       <div class="w-50 my-pagination-wrapper">
       </div>
       <div class="w-50 d-flex flex-align-center flex-justify-end">
        <button class="tool-button" onclick="${'On' + handler + 'AddClick()'}"><span class="mif-plus"></span></button>
        <button class="tool-button" onclick="${'On' + handler + 'DeleteClick()'}"><span class="mif-bin"></span></button>
        <button class="tool-button" onclick="${'On' + handler + 'SaveConfigClick()'}"><span class="mif-floppy-disk"></span></button>
       </div>    
     </div>
   </div>

  </div>`;
}

function addCameraView(agents)
{
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
     </div>`;
}

function addAgentView()
{
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

function CameraControlView()
{
  return `
   <div class="grid d-flex flex-justify-center p-2">
    <div class="row">
      <canvas id="id-cam-canvas" style="border:1px solid #e1e1e1;"> </canvas>
    </div>
    <div class="row d-flex flex-justify-center">
      <button class="button m-1 mt-2" onclick="OnCameraControl('start');">START</button>
      <button class="button m-1 mt-2" onclick="OnCameraControl('stop');">STOP</button>
    </div>
    <div class="row d-flex flex-justify-center">
      <button class="button m-1" onclick="OnCameraControl('backward');"><span class="mif-backward"></span></button>
      <button class="button m-1" onclick="OnCameraControl('play');"><span class="mif-play"></span></button>
      <button class="button m-1" onclick="OnCameraControl('pause');"><span class="mif-pause"></span></button>
      <button class="button m-1" onclick="OnCameraControl('forward');"><span class="mif-forward"></span></button>
    </div>
   </div>`;
}

function cameraControlConainer(id)
{
  return `
  <div id='${id}' class="d-flex flex-justify-center" style="width:600px;height:400px" style="display:none">

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

function render(v, id)
{
  let sections = [];

  sections.push(
    {
      title : 'CAMERAS',
      link : 'id-camera',
      content : renderList(v.data.cameras, 'id-camera-list', 'OnCameraSelect', 'mif-video-camera')
    });

  sections.push(
    {
      title : 'AGENTS',
      link : 'id-agent',
      content : renderList(v.data.agents, 'id-agent-list', 'OnAgentSelect', 'mif-display')
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

  v.page.html.right.push(renderTableView('id-camera-right', v.data.cameras, ['id', 'sid', 'source', 'target', 'tracker', 'skipcount', 'aid'], 'Camera'));
  v.page.html.center.push(cameraControlConainer('id-camera-center'));

  v.page.html.right.push(renderTableView('id-agent-right', v.data.agents, ['id', 'sid', 'host', 'port'], 'Agent'));

  v.page.html.center.push(AlertsView('id-alerts'));

  v.page.html.center.push(ReportsView('id-reports'));

  v.page.html.center.push(`
   <script>
     var g_agents = '${JSON.stringify(v.data.agents)}';
     var g_cameras = '${encodeURI(JSON.stringify(v.data.cameras))}';
     var addCameraView = "${encodeURI(addCameraView(v.data.agents))}"; //move to ui
     var addAgentView = "${encodeURI(addAgentView())}"; //move to ui
   </script>
 `);

  v.page.html.center.push(`<script src='/js/prism.js'></script>`);
}

module.exports = { render }


