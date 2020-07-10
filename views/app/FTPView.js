var css = require('../common/CSS');

var script = () => {
return `
  <script>

  let tj = {
    data: [
      [
        "x.txt",
        "-dxxxr-xx",
        "1024"
      ],
      [
        "y.txt",
        "-dxxxr-xx",
        "128"
      ],
      [
        "a.txt",
        "-dxxxr-xx",
        "1024"
      ],
      [
        "b.txt",
        "-dxxxr-xx",
        "512"
      ]                  
    ]
  }
      
      
  var ftpSessions = [];
  MessageListeners.push(ftpServiceListener);

  function showToast(m)
  {
    var o = {
      showTop: true,
      timeout: 1500
    }
    Metro.toast.create(m, null, null, "yellow", o);
  }

  function toggleFTPS(e)
  {
    if (e.checked) {
      document.getElementById('id-ftp-explicit').disabled = false;
      document.getElementById('id-ftp-implicit').disabled = false;         
    } else {
      document.getElementById('id-ftp-explicit').disabled = true;
      document.getElementById('id-ftp-implicit').disabled = true;
    }
  }

  function ftpServiceListener(json)
  {
    if (json.app != "ftp") {
      return false;
    }

    console.log(json)

    if (isDefined(json.req)) 
    {
      let id = json.id;

      switch (json.req)
      {
        case "connect":
        {
          AgentSend(
            JSON.stringify({
              app : 'ftp',
              id  : id.toString(),
              req : 'list',
              dir : '/'
            })
          );
          break;
        }
        case "list":
        {
          addRemoteListView(id, json.data);
          break;
        }
        default:
        {
          console.error("response for unknown request");
        }
      }
    }
    else if (isDefined(json.evt)) 
    {

    }
  }

  function onClickConnect(id)
  {
    var table = Metro.getPlugin('#id-ftp-ll-table', 'table');
    table.setData(tj);
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

    ftp.host = host;
    ftp.port = port;
    ftp.user = user;
    ftp.pass = pass;

    ftpSessions.push(ftp);

    AgentSend(
      JSON.stringify({
        app : 'ftp',
        req : 'connect',
        ...ftp
      })
    );
  }

  function addRemoteListView(id, list)
  {
    let lines = list.split("\\r\\n");

    let elements = [];

    //drwxr-xr-x 1 ftp ftp 0 Jun 28 00:01 System Volume Information

    lines.forEach(
      function(line, index) 
      {
        line = line.replace(/ +(?= )/g,'');
        let pp = line.split(" ");
        console.log(pp);
        let e = [];

        let name = '';
        for (let i = 8; i < pp.length; i++)
        {
          if (isDefined(pp[i]))
          {
            name += pp[i];
          }
        }

        e.push(name); //name

        e.push(pp[0]); //attributes
        e.push(pp[4]); //size
        e.push(pp[5] + " " + pp[6] + " " + pp[7]); //ts

        elements.push(e);
      }
    );
    
    let rl_table = Metro.getPlugin('#id-ftp-rl-table', 'table');
    rl_table.setData({data: elements}, true);
  }

 </script>`;
}

var savedConnectionsPanel = (id) =>
{
  return `
  ${css.MetroPanelStart(id, "Saved connection", 'mif-display')}
  
  ${css.MetroPanelEnd()}`;
}

var newConnectionPanel = (id) =>
{
  return `
    ${css.MetroPanelStart(id, "New FTP connection", 'mif-display')}
    <div class="grid">

      <div class="row pt-3">
        <div class="cell-8">
          <div class='input-control text'>
            <input id='${id}-host' type="text" class="flex rounded" placeholder='Host' data-role="input" data-clear-button="false">
          </div>
        </div>
        <div class="cell-4">
          <div class="input-control text">
            <input id='${id}-port' type="text" class="flex rounded" placeholder='Port' data-role="input" data-clear-button="false">
          </div>
        </div>
      </div>

      <div class="row pt-3"> 
       <div class="cell-6">
         <div class='input-control text'>
           <input id='${id}-user' type="text" class="flex rounded" placeholder='User' data-role="input" data-clear-button="false">
         </div>
       </div>
       <div class="cell-6">
         <div class="input-control password">
           <input id='${id}-password' type="password" class="flex rounded" placeholder='Password' data-role="input" data-clear-button="false">
         </div>
       </div>     
      </div>

      <div class="row pt-3">
        <div class="cell-4">
          <input type="checkbox" data-style="2" data-role="checkbox" data-caption="FTPS" data-caption-position="left" onclick="toggleFTPS(this)">
        </div>
        <div class="cell-6">
          <div class="row border rounded">
            <input id='${id}-explicit' name="r11" type="radio" checked
                 data-role="radio"
                 disabled
                 data-style="2"
                 data-caption="Explicit">
            <input id='${id}-implicit' name="r11" type="radio"
                 data-role="radio"
                 disabled
                 data-style="2"
                 data-caption="Implicit">
          </div>
        </div>
      </div>

      <div class="row pt-3">
        <div class="cell-12">
          <button class="flex button secondary outline rounded mb-2" onclick="onClickConnect('${id}')">CONNECT</button>
        </div>
      </div>     
    
    </div>

    ${css.MetroPanelEnd()}
  `;
}

function render(v, id)
{
  v.page.html.center += `
    ${script()}
    <div id='${id}-center' class="row" data-role="splitter" data-split-mode="vertical" data-gutter-size="5" style='display:none'>
      <div class="">${css.listPanel(id + '-rl', 'Remote directory list', 'mif-folder-open2')}</div>      
      <div class="">${css.listPanel(id + '-ll', 'Local directory list', 'mif-folder-open2')}</div>
    </div>`;

  v.page.html.right += `
    <div id='${id}-right' style='display:none'>
      ${savedConnectionsPanel(id)}
      ${newConnectionPanel(id)}
    </div>`;
}

module.exports = { render }