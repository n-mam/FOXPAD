var css = require('../common/CSS');
var input = require('../common/Input');
var fsbrowser = require('../common/FSBrowser');

function ProcessRecoveryViewResponse(m)
{
  if (m.Response === 'Get-Free-Drives')
  {
    freeDrives = m.FreeDrives.trim().split(" ");
    
    let list = '';

    freeDrives.forEach(e => {
      list += `<option value='${e}'>${e}</option>`;
    });

    document.getElementById('id-free-drives').innerHTML = list;

    return true;
  }
  else
  {
    return false;
  }
}

function StartMount()
{
  let MountCommand = 
    {
      Plugin: 'Recover',
      Action: 'Mount',
      RW: false,
      DifferencingMode: '',
      Drive: '',
      Partition: 0,
      Size: 0,
      Unit: '',
      Encrypt: false,
      ImageFile: ''
    };

  let e = document.getElementById('id-free-drives');

  MountCommand.Drive = e.value;

  e = document.getElementById('id-partition');

  if (e.value.length)
  {
    MountCommand.Partition = parseInt(e.value);
  }

  e = document.getElementById('id-mount-rw');

  if (e.checked)
  { 
    MountCommand.RW = true;
    /**
     * check for write settings
     */
    if (document.getElementById('id-write-t1').checked) {
      MountCommand.DifferencingMode = 'T1';
    } else if (document.getElementById('id-write-t2').checked) {
      MountCommand.DifferencingMode = 'T2';
    } else if (document.getElementById('id-write-direct').checked) {
      MountCommand.DifferencingMode = 'Direct';
    }
  }

  e = document.getElementById('id-size');

  if (e.value.length)
  {  
    MountCommand.Size = parseInt(e.value);
  }

  e = document.getElementById('id-unit');

  MountCommand.Unit = e.value; 

  e = document.getElementById('id-encrypt');

  MountCommand.Encrypt = e.checked;

  MountCommand.ImageFile = document.getElementById('id-browser-recover').dataset.ImageFile;

  if (isDefined(MountCommand.ImageFile) && 
      MountCommand.ImageFile.length)
  {
    AgentSend(JSON.stringify(MountCommand));
  }
  else
  {
    show_error('Please select the image file to mount');
  }
}

function render(id)
{
  return `
   <script>
     initActions.push(JSON.stringify({Plugin: 'Common', Action: 'Get-Free-Drives'}));
     ${ProcessRecoveryViewResponse.toString()}
     ${StartMount.toString()}
     MessageListeners.push(ProcessRecoveryViewResponse);
   </script>
   <div id='${id}' class='flex column' style='display:none;width:70%;'>
    <div class='flex row' style='align-items:flex-start;justify-content:space-evenly;'>
      <div class='flex column'>
      <p><b>Mount</b></p>
      ${css.spacer(2)}
      <fieldset class='flex column' data-role='controlgroup' data-type='horizontal'>
      <!--legend align='left'></legend-->
      <div class='flex row' >
        <input id='id-mount-ro' type='radio' name='mount' value='choice-1' checked='checked'/>
        <label for='id-mount-ro'>Read-Only</label> ${css.nbsp(2)}
        <input id='id-mount-rw' type='radio' name='mount' value='choice-2'/>
        <label for='id-mount-rw'>Read-Write</label> ${css.nbsp(2)}
      </div>
      ${css.spacer(3)}
      <div class='flex row'>
        <b>Drive:</b> ${css.nbsp(2)}
        <select id='id-free-drives' style='font-family: inherit;'>

        </select>
      </div>
      ${css.spacer(3)}
      <div class='flex row'>
        <b>Partition:</b> ${css.nbsp(2)}
        <input id='id-partition' type="number" name="partition" min="0" max="10" style='width:3em;'>
      </div>      
    </fieldset>
    ${css.spacer(3)}
    <p><b>Write</b></p>
    ${css.spacer(2)}    
    <fieldset class='flex column' data-role='controlgroup' data-type='horizontal'>
    <!--legend align='left'></legend-->
    <div class='flex row' >
      <input type='radio' name='write' id='id-write-t1' value='choice-1' checked='checked'/>
      <label for='id-write-t1'>Type-1</label> ${css.nbsp(2)}
      <input type='radio' name='write' id='id-write-t2' value='choice-2'/>
      <label for='id-write-t2'>Type-2</label> ${css.nbsp(2)}
      <input type='radio' name='write' id='id-write-direct' value='choice-3'/>
      <label for='id-write-direct'>Direct</label>
    </div>
    ${css.spacer(3)}
    <div class='flex row'>
     <b>Size:</b> ${css.nbsp(2)} <input id='id-size' type="number" name="Size" min="5" style='width:4em;'>
     ${css.nbsp(2)}
     <select id='id-unit' style='width:4em;'>
       <option value="MB">MB</option>
       <option value="GB">GB</option>
       <option value="TB">TB</option>
     </select>       
    </div>    
    ${css.spacer(3)}
    <div class='flex row'>
      <b>Encrypt:</b> ${css.nbsp(2)} <input id='id-encrypt' type='checkbox'>
    </div>      
  </fieldset>
 </div>
 ${css.nbsp(4)}
 <div class='flex column'>
   <p><b>Image</b></p>
   ${css.spacer(2)}
   ${fsbrowser.render('id-browser-recover')}
 </div>	  
</div>
${css.spacer(3)}
<div class='flex button action' onclick="StartMount()" style='width:6em;'>
  <p>MOUNT</p>
</div>
</div>`;
}

module.exports = { render }