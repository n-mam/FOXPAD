var u = require('../../lib/util');
var ftpView = require('./FTPView');
var cvview = require('./CvView'); 
var sshView = require('./SSHView');
var agentView = require('./AgentView');
var kissView = require('./KissView');
var backupView = require('./BackupView');
var recoveryView = require('./RecoveryView');

function index(v)
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

  v.setStatus('ok', '');
}

function ShowUserDashBoard(v)
{
  //ftpView.render(v, 'id-ftp');
  cvview.render(v, 'id-cv');
}

function ShowAdminDashBoard(v)
{

}

module.exports = { index }