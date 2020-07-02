var db = require('./db');
var u = require('./util');
var crypto = require('crypto');

var getUserById = (id, cbk) => 
{
  let sql = `select * from User where id='${id}'`;

  db.exec (sql, (e, results) => {
    if (e)
    {
      cbk(e.message);
    }
    else
    { 
      cbk(
        null,
        {
          user: u.trimNullProps(results[0])
        });
    }
  });
}

function getUser(hash, cbk)
{
  if (u.isDefined(hash))
  {
    let sql = `select * from Session where hash='${hash}'`;

    db.exec (sql, function (e, sr) {
      if (e)
      {
        cbk(e.message);
      }
      else
      {
        if (sr.length)
        {
          getUserById(sr[0].uid, cbk);
        }
        else
        {
          cbk('Invalid BH cookie');
        }
      }
    });
  }
  else
  {
    cbk('Null BH cookie');
  }
}

var create_session_id = (uid, cbk) => 
{
  let sha = crypto.createHash('sha256');

  sha.update(Math.random().toString());

  let hash = sha.digest('hex');

  let sql = `delete from Session where uid='${uid}'`;

  db.exec (sql, (e, r) => {
      if (e)
      {
        cbk(e.message);
      }
      else
      {
        let sql = `insert into Session (uid, hash) values ('${uid}', '${hash}')`;

        db.exec (sql, (e, r) => {
          if (e)
          {
            cbk(e.message);
          }
          else
          {
            cbk(null, hash);
          }
        });
      }
  });
};

var delete_session_id = () =>
{

}

module.exports = { getUser, getUserById, create_session_id, delete_session_id };