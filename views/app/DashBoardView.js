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

  v.page.html.center += ftpView.render('id-ftp');
  v.page.html.center += sshView.render('id-ssh');
  v.page.html.center += backupView.render('id-backup');
  v.page.html.center += recoveryView.render('id-recover');
  v.page.html.center += kissView.render('id-kiss');
  v.page.html.center += agentView.render('id-agent');

  v.page.html.left = accordion.render('Dashboard', sections);
}

function ShowAdminDashBoard(v)
{

}

module.exports = { index }