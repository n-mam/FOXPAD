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
        <span class="caption">Restore</span>
      </a>
    </li>
  `;

  v.page.html = `
    <h3 class="pt-2" id="id-backup">Backup</h3>
    <div class="flex-row d-flex flex-justify-center">
      <div class="grid cell-5">
        ${cc.renderTableView('id-volumes', [], ['Volume', 'Length', 'TotalClusters', 'FreeClusters'], 'Volume', 5)}
      </div>
      <div class="grid cell-1">  </div>
      <div class="grid cell-5">
        ${cc.renderTableView('id-browser', [], ['Name', 'Attribute'], 'fsbrowser', 8)}
      </div>
    </div>

    <h3 class="pt-2" id="id-recover">Restore</h3>
    <div class="flex-row d-flex flex-justify-center">
      <div class="grid cell-8">
        ${cc.renderTableView('id-backups', v.data.backups, ['id', 'timestamp', 'uid'], 'Backup', 10)}
      </div>
    </div>

    <script>
      var uid = ${v.json.prv.user.id};
      var g_agents = '${JSON.stringify(v.data.agents)}';
      var g_backups = '${encodeURI(JSON.stringify(v.data.backups))}';
    </script>
    <script src='/js/endpoint.js'></script>
  `;
}

module.exports = { render }
