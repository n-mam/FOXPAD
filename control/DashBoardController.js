// let view = require('../views/app/PrismView');
// let controller = require('./PrismController');

let view = require('../views/app/EndPointView');
let controller = require('./EndPointController');

var dashboardView = require('../views/app/DashBoardView')

function index(v)
{
  controller.index(v, (e, data) => {
    if (e)
    {
      v.setError(e);
    }
    else
    {
      v.data = data;

      dashboardView.render(v, (e) => {
        if (e)
        { 
          v.setError(e);
        }
        else
        {
          view.render(v, 'id-cv');
          v.page.nav += `
          <li class="item-separator"></li>
          <li>
            <a href="#id-agents" class="">
              <span class="icon"><span class="mif-display"></span></span>
              <span class="caption">Agents</span>
            </a>
          </li>`;
          v.setStatus('ok', '');
        }
      });
    }
  });
}

module.exports = { index }