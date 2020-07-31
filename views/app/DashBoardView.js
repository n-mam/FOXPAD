var u = require('../../lib/util');
var ftpView = require('./FTPView');
var sshView = require('./SSHView');
var agentView = require('./AgentView');
var kissView = require('./KissView');
var backupView = require('./BackupView');
var recoveryView = require('./RecoveryView');

function render(v, cbk)
{
  v.page.html.center = [];
  v.page.html.right = [];
  v.page.html.left = [];

  if (v.isSU())
  {
    ShowAdminDashBoard(v);
  }
  else
  {
    ShowUserDashBoard(v);
  }

  cbk(null);
}

function ShowUserDashBoard(v)
{

}

function ShowAdminDashBoard(v)
{

}

module.exports = { render }