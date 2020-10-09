var db = require('./db');
var ss = require('./session');
var c = require('./crud');
var u = require('./util');

function index(jb)
{
  if (!u.isDefined(jb) || !u.isDefined(jb.api))
  {
    console.log('JSON body or api undefined');
    u.send_json(200, {status: 'ERROR', msg: 'JSON body or api undefined'}, this.res);
    return;
  }

  console.log('api : ' + jb.api);

  switch (jb.api.toUpperCase())
  {
    case 'CRUD':
    {
      if (u.isDefined(this.cookie))
      {
        c.CRUD(this, jb.data);
      }
      else
      {
        u.send_json(200, {api: 'CRUD', status: 'ERROR', msg: 'CRUD: cookie not present in request'}, this.res);
      }
      break;
    }

    case 'SIGNUP':
    {
      if (jb.name == null || jb.password == null) 
      {
        u.send_json(200, {status: 'ERROR', msg: 'Username or Password missing'}, this.res);
        break;
      }

      if (jb.name.length > 254 || jb.password.length > 254) 
      {
        u.send_json(200, {status: 'ERROR', msg: 'Username Password > 254'}, this.res);
        break;
      }

      var sql = `select id, password from User where name = '${jb.name}'`;

      db.exec (sql, (e, r) => {
         if (e)
         {
           u.send_json(200, {status: 'ERROR', msg: e.toString()}, this.res);
         }
         else
         { /*
            * Query was successful. Check if we have a user by this e-mail
            */
           if (!r.length)
           { /*
              * no user exists by this email.
              */
             sql = `insert into User
                   (name, email, password, image) 
                   values 
                   (${db.esc(jb.name)}, ${db.esc(jb.email)}, ${db.esc(jb.password)}, ${db.esc(jb.avatar)})`;

             db.exec (sql, (e, r) => {
                if (e)
                {
                  u.send_json(200, {status: 'ERROR', msg: e.toString()}, this.res);   
                }
                else 
                {
                  let uid = r.insertId;

                  ss.create_session_id(uid, (e, sid) => {
                     if (e)
                     {
                       u.send_json(200, {status: `ERROR`, msg: `Failed to generate session id : ${e}`}, this.res);
                     }
                     else
                     {
                       this.res.setHeader('Set-Cookie', `BH=${sid}; Max-Age=86400`);
                       u.send_json(200, {api: 'LOGIN', status: 'OK', uname: jb.email}, this.res);
                     }
                  });
                }
             });
           }
           else
           { /*
              * user with this email already exists
              */
             u.send_json(200, {status: 'ERROR', msg: 'User Exists, please login'}, this.res);
           }
         }
      });

      break;
    }

    case 'LOGIN':
    {
      var sql = `select id, password from User where name = '${jb.name}'`;

      db.exec (sql, (e, r) => {
         if (e)
         {
           u.send_json(200, {status: 'ERROR', msg: e.toString()}, this.res);
           console.log(e.toString());
         }
         else
         {
           if (r.length == 1)
           {/*
             * a user with this email is registered
             */
             let uid = r[0].id;
             let password = r[0].password;                 

             if (jb.password == password)
             {
               ss.create_session_id(uid, (e, sid) => {
                 if (e)
                 {
                   u.send_json(200, {status: `ERROR`, msg: `Failed to generate session id : ${e}`}, this.res);
                 }
                 else
                 {
                   this.res.setHeader('Set-Cookie', `BH=${sid}; Max-Age=86400`);
                   u.send_json(200, {api: 'LOGIN', status: 'OK', uname: jb.email}, this.res);
                 }
               });
             }
             else
             {
               u.send_json(200, {status: 'ERROR', msg: 'Invalid Password'}, this.res);
             }
           } /** if (r.length) */
           else
           {
             if (r.length > 1)
             {
                u.send_json(200, {status: 'ERROR', msg: 'Multiple Users registered with this email id.'}, this.res);
             }
             else
             {
                u.send_json(200, {status: 'ERROR', msg: 'User not registered'}, this.res);
             }
           }
         }
      });

      break;
    }

    case 'LOGOUT':
    {
      if (u.isDefined(this.cookie))
      {
        this.res.setHeader('Set-Cookie', `BH=`);
        //TOD: remove from db
        u.send_json(200, {api: 'LOGOUT', status: 'OK', uname: jb.email}, this.res);
      }
      else
      {
        u.send_json(200, {api: 'LOGOUT', status: 'ERROR', msg: 'LOGOUT: Cookies not present in request'}, this.res);
      }

      break;
    }

    case "TRAIL":
    {
      console.log(jb.api + " " + jb.cid + " " + jb.aid + " " + jb.points);

      if (!u.isDefined(jb.cid) ||
          !u.isDefined(jb.aid) ||
          !u.isDefined(jb.uid) ||
          !u.isDefined(jb.points)) {
        u.send_json(200, {status: 'ERROR', msg: 'TRAIL: invalid data'}, this.res);
        break;
      }

      sql = `insert into trails (cid, aid, uid, ts, path, demography)
             values 
             (${db.esc(jb.cid)}, ${db.esc(jb.aid)}, ${db.esc(jb.uid)}, NOW(), ST_GeomFromText('MULTIPOINT(${jb.points})'), ${db.esc(jb.demography)})`;

      console.log(sql);

      db.exec (sql, (e, r) => {
        if (e)
        {
          console.log(e);
          u.send_json(200, {status: 'ERROR', msg: e.toString()}, this.res);   
        }
        else 
        {
          u.send_json(200, {api: 'TRAIL', status: 'OK'}, this.res);
        }
      });

      break;
    }

    case 'email-notify':
    {
      console.log("email-notify hit !!");
      break;
    }

    default:
      u.send_json(200, {status : 'ERROR', msg : `UNKNOWN API : ${jb.api}`}, this.res);
      break;
  }

}

module.exports = { index };