var cc = require('./CommonController');
var dc = require('./DashBoardController');

function index()
{
  cc.Initialize.bind(this)(
    function(v) {
      dc.index(v);
    }
  );
}

module.exports = { index }