var u = require('../../lib/util');
var ftpView = require('./FTPView');
var sshView = require('./SSHView');
var agentView = require('./AgentView');
var kissView = require('./KissView');
var backupView = require('./BackupView');
var recoveryView = require('./RecoveryView');
var accordion = require('../common/Accordion');

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
  let sections = [];

  sections.push(
    {
      title : 'FTP',
      link : 'id-ftp'
    });

  sections.push(
    {
      title : 'AGENT',
      link : 'id-agent'
    });

  v.page.html.center = "";
  v.page.html.right = "";  

  ftpView.render(v, 'id-ftp');
  agentView.render(v, 'id-agent');

  v.page.html.left = accordion.render('', sections);
}

function ShowAdminDashBoard(v)
{

}

module.exports = { index }