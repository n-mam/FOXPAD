var u = require('../../lib/util');
var ftpView = require('./FTPView');
var camView = require('./CameraView'); 
var sshView = require('./SSHView');
var agentView = require('./AgentView');
var kissView = require('./KissView');
var backupView = require('./BackupView');
var recoveryView = require('./RecoveryView');

function index(v)
{
  if (v.isSU())
  {
    ShowAdminDashBoard(v);
  }
  else
  {
    ShowUserDashBoard(v);
  }

  v.setStatus('ok', '');
}

function ShowUserDashBoard(v)
{
  v.page.html.center = "";
  v.page.html.right = "";
  v.page.html.left = "";  

  //ftpView.render(v, 'id-ftp');
  camView.render(v, 'id-camera');
}

function ShowAdminDashBoard(v)
{

}

module.exports = { index }