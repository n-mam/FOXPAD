var css = require('../common/CSS');
var input = require('../common/Input');
var fsbrowser = require('../common/FSBrowser');

var script = () =>
{
  return `
    <script>
     function toggleFTPS(e)
     {
       if (e.checked)
       {
         document.getElementById('id-ftps-explicit').disabled = false;
         document.getElementById('id-ftps-implicit').disabled = false;         
       }
       else
       {
        document.getElementById('id-ftps-explicit').disabled = true;
        document.getElementById('id-ftps-implicit').disabled = true;
       }
     } 
    </script>
  `;
}

function  render(id)
{
  return `
   ${script()}
   <div id=${id}'
   data-role="panel"
   data-title-caption="New FTP connection"
   data-title-icon="<span class='mif-display'></span>"
   data-collapsible="true"
   data-draggable="true">

   <div class='flex column'>
     <div class='flex mb-5'>
       <div class='input-control text' style='width:60%'>
         <input id='id-ftp-host' type="text" class="flex rounded" placeholder='Host' data-role="input" data-clear-button="false">
       </div>
       ${css.spacer(4, 'h-spacer')}
       <div class="input-control text" style='width:15%'>
         <input id='id-ftp-port' type="text" class="flex rounded" placeholder='Port' data-role="input" data-clear-button="false">
       </div>      
     </div>

     <div class="flex mb-5">
       <div class="input-control text" style='width:35%'>
         <input id='id-ftp-username' type="text" class="flex rounded" placeholder='User' data-role="input" data-clear-button="false">
       </div>
       ${css.spacer(4, 'h-spacer')}
       <div class="input-control password" style='width:35%'>
         <input id='id-ftp-password' type="password" class="flex rounded" placeholder='Password' data-role="input" data-clear-button="false">
       </div>
     </div>

     <div class="flex mb-5">
       <input type="checkbox" data-role="checkbox" data-caption="FTPS" data-caption-position="left" onclick="toggleFTPS(this)">
       ${css.spacer(4, 'h-spacer')}
       <div style="border:1px solid lightgray; border-radius: 0.3em">
        <label class="radio transition-on">
         <input id='id-ftps-explicit' type="radio" checked disabled name="r1" value="Explicit" data-role="radio" data-caption="List" title="" data-role-radio="true" class="">
           <span class="check"></span>
           <span class="caption">Explicit</span>
        </label>
        <label class="radio transition-on">
         <input id='id-ftps-implicit' type="radio" disabled name="r1" value="Implicit" data-role="radio" data-caption="List" title="" data-role-radio="true" class="">
           <span class="check"></span>
           <span class="caption">Implicit</span>
        </label>        
       </div>
     </div>

     <div class="flex">
       <button class="flex button secondary outline rounded">CONNECT</button> 
     </div>
   </div>
   </div>
   `;
}

module.exports = { render }