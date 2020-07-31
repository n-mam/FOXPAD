var prismView = require('../views/app/PrismView'); 
var prismController = require('./PrismController');
var dashboardView = require('../views/app/DashBoardView')

function index(v)
{
  prismController.index(v, (e, data) => {
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
          prismView.render(v, 'id-cv');
          v.setStatus('ok', '');
        }
      });
    }
  });
}

module.exports = { index }