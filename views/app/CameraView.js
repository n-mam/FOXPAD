var accordion = require('../common/Accordion');

var xxx = `
<ul data-role="listview" class='p-2'>
  <li data-icon="<span class='mif-video-camera fg-darkGray'>" data-caption="Parking"></li>
  <li data-icon="<span class='mif-video-camera fg-green'>" data-caption="Main Entrance"></li>
  <li data-icon="<span class='mif-video-camera fg-green'>" data-caption="Exit"></li>
  <li data-icon="<span class='mif-video-camera fg-darkGray'>" data-caption="Cafeteria"></li>
  <li data-icon="<span class='mif-video-camera'>" data-caption="Lifestyle"></li>
</ul>
`
function CameraView(id)
{
  return `
  <div id='${id}' class="row" style='display:none'>
  <div class="cell-4">
   <div class='input-control text'>
     <input id='${id}-cam-name' style='text-align:center;' type="text" class="flex" placeholder='NAME' data-role="input" data-clear-button="false">
   </div>
  </div>
  <div class="cell-6">
   <div class="input-control text">
     <input id='${id}-cam-url' style='text-align:center;' type="text" class="flex" placeholder='URL' data-role="input" data-clear-button="false">
   </div>
  </div>
  <div class="cell-2">
   <button class="button primary outline">Add</button>
  </div>
 </div>
  `;
}

function AlertView()
{
  return ``;
}

function NodesView(id)
{
  return `
    <div id='${id}' class="row" style='display:none'>
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
      content : xxx
    });

  v.page.html.center += CameraView('id-camera');

  sections.push(
    {
      title : 'ALERTS',
      link : 'id-alerts',
      content : ''      
    });

  v.page.html.center += AlertView();

  sections.push(
    {
      title : 'REPORTS',
      link : 'id-reports',
      content : ''
    });

  v.page.html.center += ReportsView();

  sections.push(
    {
      title : 'AGENTS',
      link : 'id-agents',
      content : ''
    });

  v.page.html.center += NodesView('id-agents');

  v.page.html.left = accordion.render('', sections);
}

module.exports = { render }