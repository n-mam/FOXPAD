var s;  
var host = 'localhost:8081'

function AgentSend(message)
{
  if (s.readyState !== 1) {
    TraceLog('readystate not 1 trying after 500ms', 'red'); 
    setTimeout(function() {
      AgentSend(message);
    }, 500);
  } else {
    try
    {
      s.send(message);
      TraceLog(message, 'green'); 
    } 
    catch (e)
    {
      TraceLog(e.message, 'red');
    }      
  }
}

function AgentConnect()
{
  document.getElementById('id-agent-host').value = host;

  TraceLog('Connecting to host : ' + host);

  s = new WebSocket ('ws://' + host);

  s.reconnect = true;

  s.onerror = function(e) {
    TraceLog("ws error : " + e.message, 'red');
  };

  s.onopen = function (evt) {
    let hostname = document.getElementById('id-agent-host');
    hostname.value = host;
    initActions.forEach(element => {
      AgentSend(element);
    });
  };

  s.onclose = function(e) {
    TraceLog('web socket closed. reconnecting to \'' + host + '\' in 5 second.', e.reason);
    s.AgentTimer = setTimeout(
      function() {
        AgentConnect();
      },
      5000);
  };

  s.onmessage = function (e) 
  {
    TraceLog(e.data, 'blue');

    var parts = e.data.split('\\');
    var output = parts.join('\\\\');  

    if (output[0] === '{')
    {
      let message = JSON.parse(output);

      for (let i = 0; i < MessageListeners.length; i++)
      {
        if (MessageListeners[i](message))
        {
          break;
        }
      }
    }
    else
    {
      let log = output.replace('Log : ','');

      if (log[0] === '{')
      {
        let j = JSON.parse(log);

        if (isDefined(j.Progress))
        {
          ProgressHandler(j);
        }
        else if (isDefined(j.Kiss))
        {
          showKiss(j.Image , j.Kiss);
        }
        else 
        {

        }
      }
    }
  };
}

function AgentDisconnect()
{
  TraceLog('closing ws connection to : ' + host);
  clearTimeout(s.AgentTimer);
  s.close();
}

/** this is backup progress callback; should not be here.. wtf */
function ProgressHandler(j)
{
  let a = j.File.split("\\");

  let filename = a[a.length-1];

  let e = document.getElementById('pb-' + filename);

  if (isDefined(e))
  {
    e.style.width = j.Progress + "%";
    e = document.getElementById('pb-status-' + filename);
    e.innerHTML = `${j.Progress}%`;
  }
  else
  {
    let html =
      `<div class='flex column' style='white-space:nowrap'>
         <div class='flex'><p style='padding:0.3em;color:blue;font-weight:bold;'>${filename}</p></div>
         <div class='Progress flex' style='width:100%;'>
          <div id='pb-${filename}' class='PBar flex' style='width:${j.Progress}%;height:0.3em;background-color:#00ca00'></div>
         </div>
         <div class='flex' id='pb-status-${filename}' style='width:20%;padding:0.3em;color:blue;font-weight:bold;'>${j.Progress}%</div>
      </div>`;

    let aa = j.OriginalVolume.split("\\\\?\\Volume");
    let ename = 'id-name-' + aa[1];
    document.getElementById(ename).innerHTML += html;
  }
}

function SaveAgentTrace()
{
  alert('todo');
}

function TraceLog(line, color = 'black')
{
  let trace = document.getElementById('id-agent-log');
  trace.innerHTML += "<div class='trace' style='color:" + color + "'>" + line + '</div>';
}

function ProcessConnect(e)
{
  newhost = document.getElementById('id-agent-host').value;

  if (newhost !== host)
  {
    AgentDisconnect();
    host = newhost;
    AgentConnect();
  }
  else
  {
    TraceLog('skip connecting to the same host')
  }
}

AgentConnect();