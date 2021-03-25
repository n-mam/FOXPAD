let view = require('../views/app/PrismView');
let controller = require('./PrismController');

// let view = require('../views/app/EndPointView');
// let controller = require('./EndPointController');

let dashboardView = require('../views/app/DashBoardView')

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
        }
      });
    }
  });
}

module.exports = { index }