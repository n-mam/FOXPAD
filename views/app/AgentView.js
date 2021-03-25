let css = require('../common/CSS');

var savedConnectionPanel = (id) =>
{
  return `
  <div id='${id}' class="mx-auto mb-5"
  data-role="panel"
  data-title-caption="Saved connection"
  data-title-icon="<span class='mif-display'></span>"
  data-collapsible="true"
  data-draggable="false">
  
  </div>
  `;
}

var newConnectionPanel = (id) =>
{
  return `
    <script>

    </script>

    <div id='${id}-new-connection' class="mx-auto mb-5"
    data-role="panel"
    data-title-caption="New agent connection"
    data-title-icon="<span class='mif-display'></span>"
    data-collapsible="true"
    data-draggable="false">
 
    <div class='flex column'>
      <div class='flex mb-5'>
        <div class='input-control text' style='width:60%'>
          <input id='${id}-host' type="text" class="flex rounded" placeholder='Host' data-role="input" data-clear-button="false">
        </div>
        ${css.spacer(4, 'h-spacer')}
        <div class="input-control text" style='width:25%'>
          <input id='${id}-port' type="text" class="flex rounded" placeholder='Port' data-role="input" data-clear-button="false">
        </div>      
      </div>
 
      <!--div class="flex mb-5">
        <div class="input-control text" style='width:40%'>
          <input id='${id}-username' type="text" class="flex rounded" placeholder='User' data-role="input" data-clear-button="false">
        </div>
        ${css.spacer(4, 'h-spacer')}
        <div class="input-control password" style='width:40%'>
          <input id='${id}-password' type="password" class="flex rounded" placeholder='Password' data-role="input" data-clear-button="false">
        </div>
      </div-->
 
      <div class="flex">
        <button class="flex button secondary outline rounded" onclick='ProcessConnect(this)'>CONNECT</button> 
      </div>
    </div>
    </div>
  `;
}

function logview()
{
  return `
    <div id='id-agent-log' style='font-family: monospace;'>   
    </div>`;
}

function render(v, id)
{
  v.page.html.center += `
   <div class="grid" id='${id}-center' style='display:none'>
    <div class="row pl-3 pr-3">
      <div class="cell border text-left  bd-lightGray border-size-1 rounded">${logview()}</div>
    </div>
   </div>
   <script src='/js/ws.js'></script>`;

   v.page.html.right += `
   <div id='${id}-right' style='display:none'>
     ${savedConnectionPanel('id-agent-saved-connections')}  
     ${newConnectionPanel('id-agent')}
   </div>`;
}

module.exports = { render }