var db = require('../lib/db');

function index(v, cbk)
{
  let data = {};

  let sql = `select * from Cameras`;

  db.exec (sql, (e, results) => {
    if (e)
    {
      cbk(e);
    }
    else
    {
      data.cameras = results;
      
      sql = `select * from Agents`;

      db.exec (sql, (e, results) => {
        if (e)
        {
          cbk(e);
        }
        else
        {
          data.agents = results;
          cbk(null, data);
        }
      });
    }
  });
}

module.exports = { index }