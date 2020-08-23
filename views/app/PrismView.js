var accordion = require('../common/Accordion');

function renderListView(items, id, handler, icon) 
{
  let h = ``;

  for (let i = 0; i < items.length; i++)
  { // id-camera-list-li-1, id-agent-list-li-2
    h += `<li id="${id + '-li-' + items[i].id}" 
            data-icon="<span class='${icon} fg-black'>" 
            data-caption="<span class='caption'>${items[i].sid}</span>"
          </li>`
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
      let content = rows[i][keys[j]].toString();

      if (content.indexOf(" ") === -1 && content.length > 10)
      {
        style = `style="white-space: nowrap;overflow:hidden;text-overflow:ellipsis;width: 100px;"`;
        h += `<td><div ${style}>${content}</div></td>`;
      }
      else
      {
        h += `<td>${content}</td>`;
      }
    }

    h += `</tr>`
  }

  return h;
}

function renderTableView(id, rows, columnNames, handler)
{
  return `
  <div class="cell d-flex flex-justify-center" id='${id}'>

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
        <button class="tool-button" onclick="${'On' + handler + 'EditConfigClick()'}"><span class="mif-pencil"></span></button>
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

function AlertsView()
{
  return ``;
}

function ReportsView(id, cameras)
{
  return `
  <div class="cell d-flex flex-justify-center" id='${id}'>
  <script src='js/Chart.min.js'></script>
  <div class="grid w-100">
    <div class="row d-flex flex-justify-center">
      <div class="cell-3">
        <div>
          ${renderSelect(cameras, 'id-report-cam', 'Camera:')}
        </div>
      </div>
      <div class="cell-3">
        <div>
         <select id="id-report-int" data-prepend="Interval:" data-role="select">
          <option value="1Hour">1 Hour</option>
          <option value="Today">Today</option>
          <option value="Daily">Daily</option>
          <option value="Monthly">Monthly</option>
         </select>
        </div>
      </div>
      <div class="cell-2">
        <div class="d-flex flex-align-left">
          <button class="button" onclick="OnClickAnalyzeTrail();">ANALYZE</button>
        </div>
      </div>
    </div>
    <div class="row flex-justify-center">
      <div class="cell-12">
        <div>
          <canvas id="id-chart-canvas" width="300" height:"200" style="display:none;"></canvas>
        </div>
      </div>
    </div>
   </div>
  </div>
  <script>
   let context = document.getElementById('id-chart-canvas').getContext('2d');
   var barChartData = {
    labels: [],
    datasets: 
    [
     {
      label: 'IN',
      backgroundColor: 'rgb(154, 208, 245)',
      borderColor: 'rgb(106, 183, 235)',
      borderWidth: 1,
      data: []
     },
     {
      label: 'OUT',
      backgroundColor: 'rgb(255, 177, 193)',
      borderColor: 'rgb(255, 134, 160)',
      borderWidth: 1,
      data: []
    }]
  };   
   reportchart = new Chart(context, {
     type: 'bar',
     data: barChartData,
     options:
      {
       responsive: true,
       legend: {
        position: 'top',
       },
       title: {
        display: true,
        text: 'Visitor Count'
       },
       scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'count'
          }
        }],
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: ''
          }
        }]
       }
     }
   });
  </script>
  `;
}

function render(v, id)
{
  v.page.html = `
  <h3 class="pt-2" id="id-home">Home</h3>
   <p>
    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
   </p>
   <div class="flex-row h-100 d-flex flex-justify-center">
     <div class="grid cell-6" id="main-view-left">
      A
     </div>
     <div class="grid cell-6" id="main-view-right">
      B      
     </div>
   </div>

  <h3 class="pt-2" id="id-cameras">Cameras</h3>
   <div class="flex-row h-100 d-flex flex-justify-center">
     <div class="grid cell-5" id="main-view-right">
      <div class="cell d-flex flex-justify-center h-100">
       <div data-role="panel"
          data-title-caption="<b>Cameras</b>"
          data-title-icon="<span class='mif-apps'></span>"
          data-width="240"
          data-collapsible="true"
          data-draggable="true">
        ${renderListView(v.data.cameras, 'id-camera-list', 'OnCameraSelect', 'mif-video-camera')}
       </div>
      </div>
     </div>
     <div class="grid cell-7" id="main-view-right">
      ${renderTableView('id-camera-right', v.data.cameras, ['id', 'sid', 'source', 'target', 'tracker', 'skip', 'aid', 'uid'], 'Camera')}
     </div>
   </div>

   <h3 class="pt-2" id="id-agents">Agents</h3>
   <div class="flex-row h-100 d-flex flex-justify-center">
     <div class="grid cell-5" id="main-view-right">
      <div class="cell d-flex flex-justify-center h-100">
       <div data-role="panel"
          data-title-caption="<b>Agents</b>"
          data-title-icon="<span class='mif-apps'></span>"
          data-width="240"
          data-collapsible="true"
          data-draggable="true">
        ${renderListView(v.data.agents, 'id-agent-list', 'OnAgentSelect', 'mif-display')}
       </div>
      </div>
     </div>
     <div class="grid cell-7" id="main-view-right">
      ${renderTableView('id-agent-right', v.data.agents, ['id', 'sid', 'host', 'port', 'uid'], 'Agent')}
     </div>
   </div>

   <h3 class="pt-2" id="id-reports">Reports</h3>
   <div class="flex-row h-100 d-flex flex-justify-center">
     <div class="grid cell-10" id="main-view-left">
      ${ReportsView('id-report-center', v.data.cameras)}
     </div>
   </div>

   <h3 class="pt-2" id="id-alerts">Alerts</h3>
   <div class="flex-row h-100 d-flex flex-justify-center">
     <div class="grid cell-6" id="main-view-left">
      A
     </div>
     <div class="grid cell-6" id="main-view-right">
      B      
     </div>
   </div>

   <script>
     var uid = ${v.json.prv.user.id};
     var g_agents = '${JSON.stringify(v.data.agents)}';
     var g_cameras = '${encodeURI(JSON.stringify(v.data.cameras))}';
     var addCameraView = "${encodeURI(addCameraView(v.data.agents))}"; //move to ui
   </script>
   <script src='/js/prism.js'></script>
   `;
}

module.exports = { render }


