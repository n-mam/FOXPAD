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
      title : 'SSH',
      link : 'id-ssh'
    });

  sections.push(
    {
      title : 'BACKUP',
      link : 'id-backup'
    });

  sections.push(
    {
      title : 'MOUNT',
      link : 'id-recover'
    });

  sections.push(
    {
      title : 'WEBSOCKET',
      link : 'id-ftp'
    });

  sections.push(
    {
      title : 'AGENT',
      link : 'id-agent'
    });

  v.page.html.center = "";

  ftpView.render(v, 'id-ftp');
  sshView.render(v, 'id-ssh');
  backupView.render(v, 'id-backup');
  recoveryView.render(v, 'id-recover');
  kissView.render(v, 'id-kiss');
  agentView.render(v, 'id-agent');

  v.page.html.left = accordion.render('', sections);
}

function ShowAdminDashBoard(v)
{

}

module.exports = { index }