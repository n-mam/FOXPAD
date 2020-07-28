function OnCameraSaveButton()
{
  let cam = GetCameraParams();
  SaveCameraToDB(cam);
}

function OnCameraStartButton()
{
  let cam = GetCameraParams();

  let cmd = {
    app: 'cam',
    req: 'camera-create',
    ...cam
  };

  socksend(cmd);

  cmd = {
    app: 'cam',
    sid: cam.sid,
    req: 'camera-control',
    action: 'play'
  };

  socksend(cmd);
}

function OnCameraSelect(node) 
{

}

function OnCameraControl(action)
{
  let cmd = {};
  cmd.app = 'cam';
  cmd.sid = 'qq'; //todo
  cmd.req = 'camera-control';
  cmd.action = action;
  socksend(cmd);
}

function GetCameraParams()
{
  let name = document.getElementById('new-cam-name').value;
  let source = document.getElementById('new-cam-src').value;
  let target = $('#new-cam-target').data('select').val();
  let trackers = $('#new-cam-tracker').data('select').val();

  if (!name.length ||
      !source.length ||
      !target.length ||
      !trackers.length) {
    Metro.toast.create("Please specify all camera parameters", null, null, "info");
    return;
  }

  let cam = {};

  cam.sid = name;
  cam.source = source;
  cam.target = target;
  cam.tracker = trackers;

  return cam;
}