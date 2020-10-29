let cc = require('../common/CommonControls');

function render(v, id)
{
    v.page.nav = `
    <li class="active">
      <a href="#id-backup">
        <span class="icon"><span class="mif-drive2"></span></span>
        <span class="caption">Backup</span>
      </a>
    </li>
    <li class="item-separator"></li>
    <li>
      <a href="#id-recover" class="">
        <span class="icon"><span class="mif-download"></span></span>
        <span class="caption">Recover</span>
      </a>
    </li>`;

  v.page.html = `
   <h3 class="pt-2" id="id-backup">Backup</h3>
   <div class="flex-row h-100 d-flex flex-justify-center">
     <div class="grid cell-7">
       ${cc.renderTableView('id-volumes', [], ['Name', 'Usage', 'Encrypt'], 'Volume')}
     </div>
   </div>

   <h3 class="pt-2" id="id-recover">Recover</h3>
   <div class="flex-row h-100 d-flex flex-justify-center">
     <div class="grid cell-7">
       ${cc.renderTableView('id-backups', v.data.backups, ['id', 'timestamp', 'uid'], 'Backup')}
     </div>
   </div>

   <script>
     var uid = ${v.json.prv.user.id};
     var g_agents = '${JSON.stringify(v.data.agents)}';
     var g_backups = '${encodeURI(JSON.stringify(v.data.backups))}';
   </script>
   <script src='/js/endpoint.js'></script>`;
}

module.exports = { render }
