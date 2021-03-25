var db = require('./db');
var u = require('./util');
var crypto = require('crypto');

function getUserById(id, cbk)
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

function create_session(uid, cbk)
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

function getCookie(req, k = 'BH')
{
  let result;
  let cookies;
  
  if (typeof window === 'undefined')
  { /** node */
    if (typeof req.headers.cookie != 'undefined' && 	
        req.headers.cookie != '')	
    {
      cookies = req.headers.cookie.split(';')
    }
  }
  else
  { /** browser */
    cookies = document.cookie.split(';');
  }

  if (typeof cookies != 'undefined')
  {
    cookies.forEach(cookie => {
      let [key, value] = cookie.split('=');
      if (key.trim() === k)
      {
        result = value;
      }
    })
  }

  return result;
}
 
function getPathCookie(cookie, v)
{
  let json = {};

  let value = getCookie(v.context.req, cookie);

  if (isDefined(value))
  {
    json = JSON.parse(value);
  }

  return json[v.context.path];
}

function delete_session()
{
}

module.exports = { getUser, getUserById, getCookie, create_session, delete_session };