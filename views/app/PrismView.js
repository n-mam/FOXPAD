var accordion = require('../common/Accordion');

function renderListView(items, id, handler, icon) 
{
  let h = ``;

  for (let i = 0; i < items.length; i++)
  {
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
   <div class="grid">
    <div class="row">
    <div class="table-component w-100">
     <table
       id=${id + '-table'}
       class="table row-hover text-left striped table-border"
       data-rows="8"
       data-check="true"
       data-rows-steps="8, 16"
       data-static-view="true"
       data-show-activity="false"
       data-cls-search="cell-md-8"
       data-cls-rows-count="cell-md-4" 
       data-cls-table-top="row flex-nowrap"
       data-on-check-click="${'On' + handler + 'TableNodeClick()'}"
       data-pagination-wrapper=".${id}-my-pagination-wrapper">

       <thead>
         ${renderTH(columnNames)}
       </thead>
       <tbody>
         ${renderTD(rows, columnNames)}
       </tbody>
     </table>
    </div>
    </div>
    <div class="row">
       <style> .pagination {margin:0em} </style>
       <div class="w-50 ${id}-my-pagination-wrapper">
       </div>
       <div class="w-50 d-flex flex-align-center flex-justify-end">
        <button class="tool-button" onclick="${'On' + handler + 'AddClick()'}"><span class="mif-plus"></span></button>
        <button class="tool-button" onclick="${'On' + handler + 'DeleteClick()'}"><span class="mif-bin"></span></button>
        <button class="tool-button" onclick="${'On' + handler + 'EditConfigClick()'}"><span class="mif-pencil"></span></button>
       </div>    
    </div>
   </div>`;
}

function AlertsView()
{
  return ``;
}

function ReportsView(id, cameras)
{
  let trailLengthOptions = ``;
  for (let i = 1; i < 50; i++) {
    trailLengthOptions += `<option value="${i}" ${i == 15 ? "selected" : ""}>${i}</option>`;
  }
  return `
  <div class="cell d-flex flex-justify-center" id='${id}'>
  <script src='js/Chart.min.js'></script>
  <div class="grid w-100">
    <div class="row d-flex flex-justify-center">
      <div class="cell-2">
        <div>
          ${renderSelect(cameras, 'id-report-cam', 'Camera')}
        </div>
      </div>
      <div class="cell-2">
        <div>
         <select id="id-report-int" data-prepend="Interval" data-role="select">
          <option value="1Hour">1 Hour</option>
          <option value="Today">Today</option>
          <option value="Daily">Daily</option>
          <option value="Monthly">Monthly</option>
         </select>
        </div>
      </div>
      <div class="cell-2">
        <div>
         <select id="id-report-trail-length" data-prepend="Trail" data-role="select">
           ${trailLengthOptions}
         </select>
        </div>
      </div>
      <div class="cell-2">
        <div class=" flex-align-left">
          <div class="split-button">
            <button class="button" onclick="OnClickAnalyzeTrail();">ANALYZE</button>
            <button class="split dropdown-toggle"></button>
            <ul class="d-menu" data-role="dropdown">
              <li onclick='OnClickDeleteTrail();'><a href="#">Delete</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="row flex-justify-center">
      <div class="row pt-10 cell-12 d-flex flex-justify-center">
        <div class="cell-6 pr-3">
          <canvas id="id-chart-canvas" ></canvas>
        </div>
        <div class="cell-5 pl-2">
        <table
          class="table row-hover text-left striped table-border"
          data-rows="3"
          data-rows-steps="3, 6"
          data-static-view="true"
          data-show-activity="false"
          data-cls-search="cell-md-8"
          data-cls-rows-count="cell-md-4" 
          data-cls-table-top="row flex-nowrap"
          id="id-table-thumbnails"
          data-role="table">
         <thead>
          <tr>
           <th data-sortable="false">Thumbnail</th>
           <th data-sortable="true">Timestamp</th>
           <th data-sortable="true" >Age</th>
           <th data-sortable="true" data-format="string">Gender</th>
           <th data-sortable="true" data-format="number">Trail length</th>
          </tr>
         </thead>

       </table>
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
     [{
        label: '',
        backgroundColor: 'rgb(154, 208, 245)',
        borderColor: 'rgb(106, 183, 235)',
        borderWidth: 1,
        data: []
      },
      {
        label: '',
        backgroundColor: 'rgb(255, 177, 193)',
        borderColor: 'rgb(255, 134, 160)',
        borderWidth: 1,
        data: []
      }]
  };

  /* age-gender chart */

  var AgeGenderChartData = {
    labels: [],
    datasets: [{
      label: 'Male : 0 - 18',
      backgroundColor: 'rgb(255, 0, 0)',
      stack: 'Stack M',
      data: [
       0
      ]
    }, {
      label: 'Male : 18 - 30',
      backgroundColor: 'rgb(0, 255, 0)',
      stack: 'Stack M',
      data: [ 
        0
      ]
    }, {
      label: 'Male : 30 - 40',
      backgroundColor: 'rgb(0, 0, 255)',
      stack: 'Stack M',
      data: [
        0
      ]
    }, {
      label: 'Male : 40 - 50',
      backgroundColor: 'rgb(154, 208, 245)',
      stack: 'Stack M',
      data: [
        0
      ]
    }, {
      label: 'Female : 0 - 18',
      backgroundColor: 'rgb(255, 0, 0)',
      stack: 'Stack F',
      data: [
        0
      ]
    }, {
      label: 'Female : 18 - 30',
      backgroundColor: 'rgb(0, 255, 0)',
      stack: 'Stack F',
      data: [0]
    }, {
      label: 'Female : 30 - 40',
      backgroundColor: 'rgb(0, 0, 255)',
      stack: 'Stack F',
      data: [
        0
      ]
    }, {
      label: 'Female : 40 - 50',
      backgroundColor: 'rgb(154, 208, 245)',
      stack: 'Stack F',
      data: [0]
    }]
  };

  </script>
  `;
}

function render(v, id)
{
  v.page.html = `
  <!--h3 class="pt-2" id="id-home">Home</h3>
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
   </div-->

  <h3 class="pt-2" id="id-cameras">Cameras</h3>
   <div class="flex-row h-100 d-flex flex-justify-center">
     <div class="grid cell-7" id="main-view-right">
       ${renderTableView('id-camera-right', v.data.cameras, ['id', 'sid', 'source', 'target', 'tracker', 'aid', 'uid'], 'Camera')}
     </div>
   </div>

   <h3 class="pt-2" id="id-agents">Agents</h3>
   <div class="flex-row h-100 d-flex flex-justify-center">
     <div class="grid cell-7" id="main-view-right">
       ${renderTableView('id-agent-right', v.data.agents, ['id', 'sid', 'host', 'port', 'uid'], 'Agent')}
     </div>
   </div>

   <h3 class="pt-2" id="id-reports">Reports</h3>
   <div class="flex-row h-100 d-flex flex-justify-center">
     <div class="grid cell-12" id="main-view-left">
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
   </script>
   <script src='/js/prism.js'></script>
   <script src='/js/report.js'></script>
   `;
}

module.exports = { render }


