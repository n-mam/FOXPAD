var css = require('../common/CSS');
var input = require('../common/Input');
var fsbrowser = require('../common/FSBrowser');

var savedConnectionPanel = (id) =>
{
  return `
    ${css.MetroPanelStart(id, "Saved connection")}
  
    ${css.MetroPanelEnd()}
  `;
}

var newConnectionPanel = (id) =>
{
  return `
    <script>
     
     function toggleFTPS(e)
     {
       if (e.checked) {
         document.getElementById('id-ftps-explicit').disabled = false;
         document.getElementById('id-ftps-implicit').disabled = false;         
       } else {
         document.getElementById('id-ftps-explicit').disabled = true;
         document.getElementById('id-ftps-implicit').disabled = true;
       }
     }

     MessageListeners.push(ftpServiceListener);

     function ftpServiceListener(m)
     {
       if (m.service != "ftp") {
         return false;
       }

       console.log(m)

       switch (m.response)
       {
         case "list":

         break;

         default:
           console.error("ftp service unknown response");
       }
     }

     function onClickConnect(id)
     {
       let host = document.getElementById(id+'-host').value;
       let port = document.getElementById(id+'-port').value;
       let user = document.getElementById(id+'-user').value;
       let pass = document.getElementById(id+'-password').value;

       let e = '';

       if (!port.length) e = "Please specify the FTP server port number";       
       if (!user.length) e = "Please specify the username";
       if (!pass.length) e = "Please specify the password";       
       if (!host.length) e = "Please specify the hostname or the ip address";

       if (e.length) {
         showToast(e);
         return;
       }

       let ftp = {};

       ftp.id = ftpSessions.length.toString();
       ftp.host = host;
       ftp.port = port;
       ftp.user = user;
       ftp.pass = pass;

       ftpSessions[ftp.id] = ftp;

       AgentSend(JSON.stringify({service: 'ftp', cmd: 'connect', dir: '/', ...ftp})); 
     }
    </script>

    ${css.MetroPanelStart(id, "New FTP connection")}
    <div class='flex column'>
      <div class='flex mb-5 mt-2'>
        <div class='input-control text' style='width:60%'>
          <input id='${id}-host' type="text" class="flex rounded" placeholder='Host' data-role="input" data-clear-button="false">
        </div>
        ${css.spacer(4, 'h-spacer')}
        <div class="input-control text" style='width:25%'>
          <input id='${id}-port' type="text" class="flex rounded" placeholder='Port' data-role="input" data-clear-button="false">
        </div>      
      </div>
 
      <div class="flex mb-5">
        <div class="input-control text" style='width:40%'>
          <input id='${id}-user' type="text" class="flex rounded" placeholder='User' data-role="input" data-clear-button="false">
        </div>
        ${css.spacer(4, 'h-spacer')}
        <div class="input-control password" style='width:40%'>
          <input id='${id}-password' type="password" class="flex rounded" placeholder='Password' data-role="input" data-clear-button="false">
        </div>
      </div>
 
      <div class="flex mb-5">
        <input type="checkbox" data-role="checkbox" data-caption="FTPS" data-caption-position="left" onclick="toggleFTPS(this)">
        ${css.spacer(4, 'h-spacer')}
        <div style="border:1px solid lightgray; border-radius: 0.3em">
         <label class="radio transition-on">
          <input id='${id}-explicit' type="radio" checked disabled name="r1" value="Explicit" data-role="radio" data-caption="List" title="" data-role-radio="true" class="">
            <span class="check"></span>
            <span class="caption">Explicit</span>
         </label>
         <label class="radio transition-on">
          <input id='${id}-implicit' type="radio" disabled name="r1" value="Implicit" data-role="radio" data-caption="List" title="" data-role-radio="true" class="">
            <span class="check"></span>
            <span class="caption">Implicit</span>
         </label>        
        </div>
      </div>
      <button class="flex button secondary outline rounded mb-2" onclick="onClickConnect('${id}')">CONNECT</button>
    </div>
    ${css.MetroPanelEnd()}
  `;
}

var listPanel = (id, title) => {
 return `
 ${css.MetroPanelStart(id, title)}
 <ul data-role="listview" id="listview-3" data-view="list" data-select-node="true" data-selectable="false" data-select-current="false">
  <li data-icon="<span class='mif-folder fg-orange'>" data-caption="Video"></li>
  <li data-icon="<span class='mif-folder fg-cyan'>" data-caption="Images"></li>
  <li data-icon="<span class='mif-folder fg-green'>" data-caption="Documents"></li>
  <li data-icon="<span class='mif-folder-download fg-blue'>" data-caption="Downloads"></li>
  <li data-icon="<span class='mif-folder'>" data-caption="Desktop"></li> 
 </ul>
 ${css.MetroPanelEnd()}
 `;
}

function render(v, id)
{
  v.page.html.center += `
    <script>
      var ftpSessions = [];
      function showToast(m) {
        var o = {
          showTop: true,
          timeout: 1500
        }
        Metro.toast.create(m, null, null, "yellow", o);
      }      
    </script>
    <div id='${id}-center' class="row" style='display:none'>
      <div class="cell">${listPanel(id + '-ll', 'Local directory list')}</div>
      <div class="cell">${listPanel(id + '-rl', '192.168.0.1')}</div>
    </div>`;

  v.page.html.right += `
    <div id='${id}-right' style='display:none'>
      ${savedConnectionPanel(id +'-saved-connections')}  
      ${newConnectionPanel(id +'-new-connection')}
    </div>`;
}

module.exports = { render }