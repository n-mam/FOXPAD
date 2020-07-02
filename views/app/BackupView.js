var css = require('../common/CSS');
var input = require('../common/Input');
var listRow = require('../common/ListRow');
var fsbrowser = require('../common/FSBrowser');

function ProcessBackupViewResponse(m)
{
  if (m.Response === 'Get-Volumes')
  {
    let html =
     `<div class='le-volume le-header-volume flex row'>\n` +
       `<div class='lse-volume lse-check'></div>` +
       `<div class='lse-volume'><b>Name</b></div>` +
       `<div class='lse-volume'><b>Usage</b></div>` +
       `<div class='lse-volume lse-check'><b>Encrypt</b></div>` +
      `</div>`;

    html += "<div class='lc-volume flex column hide-scroll'>";

    m.Volumes.forEach(
     function(item, index) 
     {     
       let name = `<div class='flex column' id='id-name-${item['GUID']}'>`;

       if (item['GUID'].includes('ShadowCopy'))
       {
         name +=
          `<div class='flex' style='padding:0.3em;'>
            <b>${item['GUID']}
              ${(item['Name'].length) ? `<div class='flex'>(${item['Name']})</div>` : ``}
            </b>
           </div>`;
       }
       else if (isDefined(item.Name) && item['Name'].length) 
       {
        name += 
        `<div class='flex' style='padding:0.3em;'>
           <b>${item['Name']}
           ${(item['Paths'].length) ? `<div class='flex'>(${item['Paths']})</div>` : ``}
           </b>
         </div>`;
       }
       else if (item['Paths'].length)
       {
         name += `<div class='flex' style='padding:0.3em;'><b>${item['Paths']}</b></div>`;
       }

       if (isDefined(item.FsName) && item['FsName'].length)
       {
         name += `<div class='flex' style='padding:0.3em;'>${item['FsName']}</div>`;
       }

       name += "</div>"

       let rocolor = 'white'
       let rwcolor = 'white';

       let row = '';
       row += `<div class='le-volume flex row' style='background-color:${item['ReadOnly'] === 'True' ? rocolor : rwcolor}'>`;
       row += `<div class='lse-volume lse-check'>
                 <input type='checkbox' name='volume-check-${item['GUID']}' value='${item['GUID']}'>
              </div>`;
       row += `<div class='lse-volume'>` + name + `</div>`;

       let freeinGB = Math.round(((item.FreeClusters*item.BytesPerCluster)/(1024*1024*1024)) * 100) / 100;
       let sizeinGB = Math.round((item.Length/(1024*1024*1024)) * 100) / 100;       

       row += "<div class='lse-volume flex column'>" + 
                   "<div class='Progress flex'>" +
                     "<div class='PBar flex' style='width:" + Math.round(((sizeinGB - freeinGB) / sizeinGB)*100) + "%;justify-content: flex-start;'>" +
                     "</div>" +
                   "</div>" +
                   ((!isNaN(freeinGB) && !isNaN(sizeinGB)) ? ("<div style='padding:0.3em;'>" + freeinGB + " GB free of " + sizeinGB + " GB</div>") : " ") +
                "</div>";
       row += `<div class='lse-volume lse-check'>
                 <input id='id-encrypt-${item['GUID']}' type='checkbox'>
               </div>`;
       row += "</div>";
       html += row;
     }
    );

    html += "</div>";

    let lc = document.getElementById('id-volumes');

    lc.innerHTML = html;

    return true;
  }
  else
  {
    return false;
  }
}

function StartBackup()
{
  let backupCommand = { Plugin: 'Backup', Action: 'Backup', Set: []};

  var d = new Date();
  
  let prefix = d.toDateString().split(" ").join("-").toLowerCase() + '-' + d.getHours() + '-' + d.getMinutes() + '-' + d.getSeconds() + '.img';
  
  let eFolder = document.getElementById('id-browser-backup-fs-path');

  let inputs = document.getElementsByTagName("input");

  for (let i = 0; i < inputs.length; i++) 
  {
    if (inputs[i].type === 'checkbox' && 
        inputs[i].name.startsWith('volume-check'))
    {
      if (inputs[i].checked)
      {
        let eCheck = document.getElementById(`id-encrypt-${inputs[i].value}`);

        backupCommand.Set.push(
          {
            GUID: inputs[i].value,
            Type: 'T2',
            Encrypt: eCheck.checked,
            File: prefix, 
            Folder: eFolder.value
          });
      }
    }
  }

  if (backupCommand.Set.length)
  {
    AgentSend(JSON.stringify(backupCommand)); 
  }
  else
  {
    show_error('Please select the volumes to backup'); 
  }
}

function render(id)
{
  return `
    ${listRow.style({name: 'volume', Usage: '', Encrypt: ''})}
    ${input.style_progress(0)}
    <script>
      initActions.push(JSON.stringify({Plugin: 'Common', Action: 'Get-Volumes'}));
      ${StartBackup.toString()}
      ${ProcessBackupViewResponse.toString()}
      MessageListeners.push(ProcessBackupViewResponse);
    </script>
    <div id='${id}' class='flex column' style='display:none;width:80%'>
      <div class='flex row' style='width:100%;align-items:flex-start;'>
        <div class='flex column' style='width:80%;justify-content:flex-start;'>
          <p><b>Volumes</b></p>
          ${css.spacer(2)}
          <div id='id-volumes' class='flex column lr-volume' style='width:100%;justify-content:flex-start;'>

          </div>
        </div>
        ${css.nbsp(4)}
        <div class='flex column' style='justify-content:flex-start;'>
          <p><b>Backup folder</b></p>
          ${css.spacer(2)}
          ${fsbrowser.render('id-browser-backup', 'Folder')}
        </div>
      </div>
      ${css.spacer(3)}
      <div class='flex button action' onclick="StartBackup()" style='width:6em;'>
        <p>BACKUP</p>
      </div>
    </div>
    `;
}

module.exports = { render }