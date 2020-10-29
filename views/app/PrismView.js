let cc = require('../common/CommonControls');

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
          ${cc.renderSelect(cameras, 'id-report-cam', 'Camera')}
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
          <canvas id="id-chart-canvas"></canvas>
        </div>
        <div class="cell-5 pl-2">

         <table
          class="table row-hover text-left striped table-border"
          data-rows="3"
          data-check="true"
          data-rows-steps="3, 6"
          data-static-view="true"
          data-show-activity="false"
          data-cls-search="cell-md-8"
          data-cls-rows-count="cell-md-4" 
          data-cls-table-top="row flex-nowrap"
          id="id-table-thumbnails"
          data-role="table"
          data-pagination-wrapper=".trail-table-pagination-wrapper">
         <thead>
          <tr>
            <th data-sortable="true">ID</th>
            <th data-sortable="false">Thumbnail</th>
            <th data-sortable="true">Timestamp</th>
            <th data-sortable="true">Age</th>
            <th data-sortable="true" data-format="string">Gender</th>
            <th data-sortable="true" data-format="number">Trail length</th>
          </tr>
         </thead>

        </table>
        <div class="row">
          <style> .pagination {margin:0em} </style>
          <div class="w-75 trail-table-pagination-wrapper">
          </div>
          <div class="w-25 d-flex flex-align-center flex-justify-end">
           <button class="tool-button" onclick="OnClickTrailDelete()"><span class="mif-bin"></span></button>
           <button class="tool-button" onclick="OnClickTrailEdit()"><span class="mif-pencil"></span></button>
          </div>    
         </div>    
          </div>    
        </div>

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
      label: 'Male : 19 - 35',
      backgroundColor: 'rgb(0, 255, 0)',
      stack: 'Stack M',
      data: [ 
        0
      ]
    }, {
      label: 'Male : 36 - 50',
      backgroundColor: 'rgb(0, 0, 255)',
      stack: 'Stack M',
      data: [
        0
      ]
    }, {
      label: 'Male : 51 - 75',
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
      label: 'Female : 19 - 35',
      backgroundColor: 'rgb(0, 255, 0)',
      stack: 'Stack F',
      data: [0]
    }, {
      label: 'Female : 36 - 50',
      backgroundColor: 'rgb(0, 0, 255)',
      stack: 'Stack F',
      data: [
        0
      ]
    }, {
      label: 'Female : 51 - 75',
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
  v.page.nav = `
  <li class="active">
    <a href="#id-cameras">
      <span class="icon"><span class="mif-video-camera"></span></span>
      <span class="caption">Cameras</span>
    </a>
  </li>
  <li class="item-separator"></li>
  <li>
    <a href="#id-reports">
      <span class="icon"><span class="mif-chart-line"></span></span>
      <span class="caption">Reports</span>
    </a>
  </li>`;

  v.page.html = `
  <h3 class="pt-2" id="id-cameras">Cameras</h3>
   <div class="flex-row h-100 d-flex flex-justify-center">
     <div class="grid cell-7">
       ${cc.renderTableView('id-camera', v.data.cameras, ['id', 'sid', 'source', 'target', 'tracker', 'aid', 'uid'], 'Camera')}
     </div>
   </div>

   <h3 class="pt-2" id="id-agents">Agents</h3>
   <div class="flex-row h-100 d-flex flex-justify-center">
     <div class="grid cell-7">
       ${cc.renderTableView('id-agent', v.data.agents, ['id', 'sid', 'host', 'port', 'uid'], 'Agent')}
     </div>
   </div>

   <h3 class="pt-2" id="id-reports">Reports</h3>
   <div class="flex-row h-100 d-flex flex-justify-center">
     <div class="grid cell-12">
      ${ReportsView('id-report-center', v.data.cameras)}
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


