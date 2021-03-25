let u = require('../lib/util');
let db = require('../lib/db');
let ss = require('../lib/session');
let mainView = require('../views/common/MainView');

function Initialize(cbk)
{
  let v = mainView.getView(this);

  let sql = v.json.prv.sql;

  ss.getUser(this.cookie, function(e, data = {}) {
    if (e)
    {
      v.setStatus('Error', e);
    }
    else if (u.isDefined(data.user))
    {
      v.setUserData(data);

      if (u.isDefined(sql))
      {
        db.exec (sql, (e, results) => {
          if (e)
          {
            v.setStatus('Error', e);
          }
          else
          {
            cbk(v, results);
          }
        });  
      }
      else
      {
        cbk(v);
      }
    }
    else
    {
      v.setStatus('Error', 'user not logged in');
    }
  });
}

module.exports = { Initialize }