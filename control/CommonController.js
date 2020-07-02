var u = require('../lib/util');
var db = require('../lib/db');
var ss = require('../lib/session');
var mainView = require('../views/common/MainView');
var commonView = require('../views/app/CommonView');
var listChecked = require('../views/common/ListChecked');

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
      v.setStatus('Error', 'User not logged in');
    }
  });
}

function AddNewControl({name, pk, fk, fk1, fk2, c1, c2, c3, c4, c5}, authorization, cbk, v, id, visible = true)
{
  let html = ``; 

  if (authorization())
  {
    html = commonView.AddNewTarget({name, pk, fk, fk1, fk2, c1, c2, c3, c4, c5}, id, visible);
  }
  else
  {
    html = mainView.message(`User not authorized to add new '${name}'`);
  }

  if (u.isDefined(v.page.html.center))
  {
    v.page.html.center += html;
  }
  else
  {
    v.page.html.center = html;
  }

  if (u.isDefined(cbk))
  {
    cbk();
  }
}

/*
 * master - refrence list
 * target - existing list
 */
function checkedList(master, target, targetSource, title, subtitle, authorization, cbk, v)
{
  let html = ``;

  if (authorization())
  {
    html =
     listChecked.render(
       master,
       target,
       targetSource,
       title,
       subtitle);
  }
  else
  {
    html = `User not authorized to add ${targetSource.name}`;
  }

  if (u.isDefined(v.page.html.center))
  {
    v.page.html.center += html;
  }
  else
  {
    v.page.html.center = html;
  }

  if (u.isDefined(cbk))
  {
    cbk(v);
  }

}

module.exports = { Initialize, AddNewControl, checkedList }