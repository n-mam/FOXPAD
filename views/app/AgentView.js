var css = require('../common/CSS')

var style = () => {
  return `
   <style>
    #id-agent { }
    #id-agent-status {
      color: #ff0000;
      font-weight: bold;
    }
    .log {
      width: 70%;
      overflow: auto;
      max-height:45em;
      min-height:45em;
      text-align: left;
      font-family: monospace;
    }
    .trace {
      word-wrap: break-word;
      margin: 0.5em;
    }
    .trace:hover {
      background-color:lightgrey;
    }
   </style>`;
}

function render(id)
{
  return `
     ${style()}
     <div id='${id}' class='flex column' style='display:none;width:100%;'>
      <div class='flex'>
        <input id='id-agent-host' type="text" class="flex" placeholder='Host' data-role="input" data-clear-button="false">
        ${css.spacer(4, 'h-spacer')}
        <div class="input-control text">
         <input id='id-agent-port' type="text" class="flex mini" placeholder='Port' data-role="input" data-clear-button="false">
        </div>
        ${css.spacer(4, 'h-spacer')}
        <button id='id-agent-connect' class="flex button dark outline rounded" onclick='ProcessConnect(this)'>CONNECT</button>
      </div>
      ${css.spacer(4)}
      <div class='flex row' style='width:100%'>
       ${logview()}
      </div>
      ${css.spacer(2)}
      <div class='flex row' style='width:100%'>
       <button class="flex button dark outline rounded" style='min-width:6em' onclick='SaveAgentTrace()'>SAVE</button>
       ${css.nbsp(2)}
       <button class="flex button dark outline rounded" style='min-width:6em' onclick='document.getElementById('id-agent-log').innerHTML='''>CLEAR</button>
      </div>
     </div>
     <script src='/js/ws.js'></script>`;
}

function logview()
{
  return `
    <div id='id-agent-log' class='log'>
    
    </div>`;
}
module.exports = { render }