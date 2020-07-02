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
      width: 60%;
      overflow: auto;
      max-height:45em;
      min-height:45em;
      text-align: left;
      font-family: monospace;
      border: 1px solid var(--border-color);
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
      <div class='flex column'>

        <div class='flex row' style='align-items:flex-end'>
         <input id='id-agent-host' type='text' placeholder='Hostname'>
         ${css.nbsp(2)}
         <div id='id-agent-connect' class='flex button' onclick='ProcessConnect(this)'>CONNECT</div>
        </div>
      
        ${css.spacer(2)}
      </div>
      <div class='flex row' style='width:100%'>
       ${logview()}
      </div>
      ${css.spacer(2)}
      <div class='flex row' style='width:100%'>
       <div class='flex button action' onclick="SaveAgentTrace()" style='width:6em;'>
        <p>SAVE</p> 
       </div>
       ${css.nbsp(2)}
       <div class='flex button action' onclick="document.getElementById('id-agent-log').innerHTML=''" style='width:6em;'>
        <p>CLEAR</p>
       </div>
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