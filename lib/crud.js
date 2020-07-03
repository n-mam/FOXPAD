var ss = require('./session');
var db = require('./db');
var u = require('./util');

var CRUD = (ctx, data) =>
{
  ss.getUser(ctx.cookie, (e, user) => {
    if (e)
    {
      u.send_json(200, {status: 'ERROR', msg: `${data.action}: ${e}`}, ctx.res);
      return;
    }
    else
    {
      _CRUD(ctx.res, data);
    }
  });
}

var _CRUD = (res, data) => 
{
  if (!isValid(data))
  {
    u.send_json(200, {status: 'ERROR', msg: `_CRUD: data, table or rows missing`}, res);
    return;
  }

  console.log(data);

  var action = data.action.toUpperCase();

  var id;

  for (let i = 0; i < data.rows.length; i++)
  {
    var row = data.rows[i];

    if (u.isDefined(row.id))
    {
      id = row.id;
      delete row.id;
    }

    var keys = Object.keys(row);
    var values = Object.values(row);

    if (!u.validateKeyValue(keys, values))
    {/*
      * This does't apply to primary key id 
      * since that would be removed above.
      */
      u.send_json(200, {status: 'ERROR', msg: `${action}: key value validation failed`}, res);
      return;
    }

    var sql;

    switch (action)
    {
      case 'CREATE':
      {
        var k = "", v = "";

        for (var j = 0; j < keys.length; j++)
        {
          k += `${keys[j].trim()},`;
          v += `"${values[j].trim()}",`;
        }
    
        k = k.replace(/,\s*$/, "");
        v = v.replace(/,\s*$/, "");
    
        sql = `INSERT INTO ${data.table} (${k}) VALUES (${v})`;
  
        break;
      }

      case 'UPDATE':
      {
        var update = "";
  
        for (var j = 0; j < keys.length; j++)
        {
          update += `${keys[j].trim()}="${values[j].trim()}",`;
        }

        update = update.replace(/,\s*$/, "");

        sql = `UPDATE ${data.table} SET ${update} WHERE id=${id}`;

        break;
      }

      case 'DELETE':
      {
        sql = `DELETE FROM ${data.table} WHERE id=${id}`;

        break;
      }
    }
  
    var success = 0;
    var faliure = 0;

    db.exec (sql, (e, r) => {

       e ? faliure++ : success++;

       if (success + faliure === data.rows.length)
       {
         if (faliure)
         {
           u.send_json(200, {status: 'ERROR', msg: e.message }, res);
           console.log(e.message);
         }
         else
         {
           u.send_json(200, {status: 'OK', msg: `${action} successfull`}, res);
           console.log('Affected rows : ' + r.affectedRows + ', Changed rows : ' + r.changedRows);
         }
       }
    });
  }
}

var isValid = (d) =>
{
  if (!u.isDefined(d) ||
      !u.isDefined(d.action) ||
      !u.isDefined(d.table) ||
      !u.isDefined(d.rows))
    return false;
  else
    return true;
}

module.exports = { CRUD };