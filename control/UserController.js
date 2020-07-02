var u = require('../lib/util');
var cc = require('./CommonController');
var input = require('../views/common/Input');
var userView = require('../views/app/UserView');
var mainView = require('../views/common/MainView');

function show()
{
  let v = mainView.getView(this);

  let id = this.params.get('id');
  let uid = this.params.get('uid');
  let mid = this.params.get('mid');
  let bid = this.params.get('bid');

  v.json.prv.sql = `select * from User where id='${u.isDefined(uid) ? uid : id}'`;

  if (u.isDefined(mid))
  {
    v.json.prv.sql += `;select * from Merchant where id='${mid}'`;
  } 

  if (u.isDefined(bid))
  {
    v.json.prv.sql += `;select * from Branch where id='${bid}'`;
  } 

  cc.Initialize.bind(this)(
    function(v, results) {
    v.page.nav = 
      mainView.navigation(
        u.isDefined(results[1]) ? 
        {
          name: results[1][0].name,
          id: results[1][0].id
        } : undefined,
        u.isDefined(results[2]) ? 
        {
          name: results[2][0].name,
          id: results[2][0].id
        } : undefined);

    v.page.html.center =
      userView.ShowProfile(
        u.isDefined(results[0][0]) ? 
          results[0][0] : results[0]) ;
    
    v.setStatus('ok', '');
  });
}

function add()
{
  cc.Initialize.bind(this)(
    function(v) {
      cc.AddNewControl(
        {
          name: 'User',
          pk: 'id',
          c1:
          {
            name: 'name',
            render: input.Text.bind(this, undefined, 'Name')
          },      
          c2:
          {
            name: 'email',
            render: input.Text.bind(this, undefined, 'E-Mail')
          },
          c3:
          {
            name: 'password',
            render: input.Text.bind(this, undefined, 'password')
          }
        },
        () => {
          return v.isSU();
        },
        () => {
          v.page.nav = mainView.navigation();
          v.setStatus('ok', '');
        },
        v);
    });
}



module.exports = { show, add };