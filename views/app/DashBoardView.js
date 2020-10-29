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
      <span class="icon"><span class="mif-display"></span></span>
      <span class="caption">Agents</span>
    </a>
  </li>`;

  v.page.html += `
  <h3 class="pt-2" id="id-agents">Agents</h3>
  <div class="flex-row h-100 d-flex flex-justify-center">
    <div class="grid cell-7">
      ${cc.renderTableView('id-agent', v.data.agents, ['id', 'sid', 'host', 'port', 'uid'], 'Agent')}
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