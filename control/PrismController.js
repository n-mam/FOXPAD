let db = require('../lib/db');

function index(v, cbk)
{
  let data = {};

  let sql = `select * from Cameras where uid = ${v.json.prv.user.id}`;

  db.exec (sql, (e, results) => {
    if (e)
    {
      cbk(e);
    }
    else
    {
      data.cameras = results;

      sql = `select * from Agents where uid = ${v.json.prv.user.id}`;

      db.exec (sql, (e, results) => {
        if (e)
        {
          cbk(e);
        }
        else
        {
          data.agents = results;

          sql = `select * from FaceGallery where uid = ${v.json.prv.user.id}`;

          db.exec (sql, (e, results) => {
            if (e)
            {
              cbk(e);
            }
            else
            {
              data.gallery = results;

              cbk(null, data);
            }
          });
        }
      });
    }
  });
}

module.exports = { index }