let cc = require('../common/CommonControls');

function render(v, cbk)
{
  v.page.html.center = [];
  v.page.html.right = [];
  v.page.html.left = [];

  if (v.isSU())
  {
    ShowAdminDashBoard(v);
  }
  else
  {
    ShowUserDashBoard(v);
  }

  cbk(null);

  v.page.nav += ` 
  <li class="item-separator"></li>
  <li>
    <a href="#id-agents" class="">
      <span class="icon"><span class="mif-flow-tree"></span></span>
      <span class="caption">Agents</span>
    </a>
  </li>`;

  v.page.html += `

  <div class="flex-row d-flex flex-justify-center pb-5 pt-10">
    <div class="grid cell-12">
      <div data-role="panel" class="rounded"
           data-width="900"
           data-cls-title="bg-gray"
           data-cls-title-icon="bg-gray"
           data-cls-collapse-toggle="bg-gray"
           data-title-icon="<span class='mif-flow-tree'></span>"
           data-title-caption="Agents"
           data-collapsible="true"
           id="id-agents">
        ${cc.renderTableView('id-agent', v.data.agents, ['id', 'sid', 'host', 'port'], 'Agent', 6)}
      </div>
    </div>
  </div>`;

  v.setStatus('ok', '');
}

function ShowUserDashBoard(v)
{

}

function ShowAdminDashBoard(v)
{

}

module.exports = { render }