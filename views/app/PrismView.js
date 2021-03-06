let cc = require('../common/CommonControls');
let upload = require('../common/Upload');

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
      <div class="cell-3">
        <div>
          ${cc.renderSelect(cameras, 'id-report-cam', 'Camera')}
        </div>
      </div>
      <div class="cell-3">
        <div>
         <select id="id-report-int" data-prepend="Interval" data-role="select">
          <option value="1Hour">1 Hour</option>
          <option value="Today">Today</option>
          <option value="Daily">Daily</option>
          <option value="Monthly">Monthly</option>
         </select>
        </div>
      </div>
      <div class="cell-3">
        <div>
         <select id="id-report-trail-length" data-prepend="Trail" data-role="select">
           ${trailLengthOptions}
         </select>
        </div>
      </div>
      <div class="cell-3">
        <div style="text-align: left;">
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

    <div class="row d-flex flex-justify-center">
        <div class="cell-12">
         <table
            class="table row-hover text-left striped table-border"
            data-rows="5"
            data-check="true"
            data-rows-steps="5, 10"
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
            <th data-sortable="true">id</th>
            <th data-sortable="false">thumb</th>
            <th data-sortable="true">ts</th>
            <th data-sortable="true">name</th>
            <th data-sortable="true">age</th>
            <th data-sortable="true" data-format="string">gender</th>
            <th data-sortable="true" data-format="number">trail(count)</th>
           </tr>
          </thead>
         </table>
         <div class="row">
          <style> .pagination {margin:0em} </style>
          <div class="w-75 trail-table-pagination-wrapper"></div>
          <div class="w-25 d-flex flex-align-center flex-justify-end">
            <button class="tool-button" onclick="OnClickTrailDelete()"><span class="mif-bin"></span></button>
            <button class="tool-button" onclick="OnClickTrailEdit()"><span class="mif-pencil"></span></button>
          </div>    
         </div>
        </div>
    </div>

    <div class="row d-flex flex-justify-center">
       <div class="cell-12" style="border:1px solid lightgrey">
         <canvas id="id-chart-canvas" style="width:500px; height: 380px;"> </canvas>
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
  </li>
  <li class="item-separator"></li>
  <li>
    <a href="#id-gallery">
      <span class="icon"><span class="mif-upload"></span></span>
      <span class="caption">Face Gallery</span>
    </a>
  </li>
  `;

  v.page.html = `
   <div class="flex-row d-flex flex-justify-center pb-5 pt-10">
     <div class="grid cell-12">
       <div data-role="panel" class="rounded"
            data-width="900"
            data-cls-title="bg-gray"
            data-cls-title-icon="bg-gray"
            data-cls-collapse-toggle="bg-gray"
            data-title-icon="<span class='mif-video-camera'></span>"
            data-title-caption="Cameras"
            data-collapsible="true"
            id="id-cameras">
         ${cc.renderTableView('id-camera', v.data.cameras, ['id', 'sid', 'source', 'target', 'tracker', 'aid'], 'Camera', 12)}
       </div>
     </div>
   </div>

   <div class="flex-row d-flex flex-justify-center pb-5 pt-10">
     <div class="grid cell-12">
       <div data-role="panel" class="rounded"
            data-width="900"
            data-cls-title="bg-gray"
            data-cls-title-icon="bg-gray"
            data-cls-collapse-toggle="bg-gray"
            data-title-icon="<span class='mif-chart-line'></span>"
            data-title-caption="Reports"
            data-collapsible="true"
            id="id-reports">
         ${ReportsView('id-report-center', v.data.cameras)}
       </div>
     </div>
   </div>


   <div class="flex-row d-flex flex-justify-center pb-5 pt-10">
     <div class="grid cell-12">
       <div data-role="panel" class="rounded"
            data-width="900"
            data-cls-title="bg-gray"
            data-cls-title-icon="bg-gray"
            data-cls-collapse-toggle="bg-gray"
            data-title-icon="<span class='mif-upload'></span>"
            data-title-caption="Face Gallery"
            data-collapsible="true"
            id="id-gallery">
         ${cc.renderTableView('id-face-gallery', v.data.gallery, ['id', 'name', 'images', 'tags'], 'Gallery', 12)}
       </div>
     </div>
   </div>

   <script>
     var uid = ${v.json.prv.user.id};
     var g_agents = '${JSON.stringify(v.data.agents)}';
     var g_cameras = '${encodeURI(JSON.stringify(v.data.cameras))}';
   </script>
   <script src='/js/prism.js'></script>
   <script src='/js/report.js'></script>
   <script src='/js/gallery.js'></script>
   `;
}

module.exports = { render }


