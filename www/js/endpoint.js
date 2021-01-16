function OnAgentConnect()
{
  let cmd = {};

  cmd.app = 'os';

  cmd.req = 'get-directory-list';
  Agents[0].send(cmd);

  cmd.req = 'get-volume-list';
  Agents[0].send(cmd);
}

function OnAgentMessage(res) 
{
  if (res.req == 'get-directory-list')
  {
    let table = Metro.getPlugin('#id-browser-table', 'table');

    res.List.forEach(e => {
      let row = [ e.name, e.type ];
      table.addItem(row, true);
    });
  }
  else if (res.req == 'get-volume-list')
  {
    let table = Metro.getPlugin('#id-volumes-table', 'table');

    res.List.forEach(e => {

      let length = 0;
      let units = 'B';
      let name = e.paths.replace(/\\\\/g, "\\") + " <br/>" + 
                 e.guid.replace(/\\\\/g, "\\");

      if (parseInt(e.length) >= (1 * 1024 * 1024 * 1024)) {
        length = e.length / (1 * 1024 * 1024 * 1024);
        units = 'G';
      }
      else if (parseInt(e.length) >= (1 * 1024 * 1024)) {
        length = e.length / (1 * 1024 * 1024);
        units = 'M';
      }

      let row = [  
        name,
        length.toFixed(1).toString() + ' ' + units,
        e.TotalClusters,
        e.Freeclusters
      ];

      table.addItem(row, true);
    });
  }
  else
  {
    console.log("endpoint : unknown agent message");
  }
}

function InitEndpoint()
{
  Agents[0]['onconnect'] = OnAgentConnect;
  Agents[0]['onmessage']['os'] = OnAgentMessage;
  Agents[0]['onmessage']['br'] = OnAgentMessage;

  $("#id-volumes-table").table();

  $("#id-volumes-table").on("click", "td:not(.check-cell)", function() {
    let e = $(this);
    while (!e.hasClass("check-cell")) {
      e = e.prev();
    }
    OnVolumeSelect(e.next().text());
  });

  $("#id-browser-table").table();

  $("#id-browser-table").on("click", "td:not(.check-cell)", function() {
    let e = $(this);
    while (!e.hasClass("check-cell")) {
      e = e.prev();
    }
    OnFSBrowserSelect(e.next().text());
  });

  $("#id-backups-table").table();

  $("#id-backups-table").on("click", "td:not(.check-cell)", function() {
    let e = $(this);
    while (!e.hasClass("check-cell")) {
      e = e.prev();
    }
    OnBackupsSelect(e.next().text());
  });
}

function OnFSBrowserSelect()
{

}
function OnVolumeSelect()
{

}

windowOnLoadCbk.push(InitEndpoint);