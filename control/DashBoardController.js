let appview = require('../views/app/PrismView');
let appctrl = require('./PrismController');

// let appview = require('../views/app/EndPointView');
// let appctrl = require('./EndPointController');

let dashboardView = require('../views/app/DashBoardView')

function index(v)
{
  appctrl.index(v, (e, data) => {
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
          appview.render(v, 'id-main-app');
        }
      });
    }
  });
}

module.exports = { index }