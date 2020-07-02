var fs = require('fs');
var u = require('../lib/util');

function index(buf)
{
  let folder = this.params.get(`folder`);
  let file = this.params.get(`file`);

  console.log('FileController: uploading ' + file + ' to ' + folder);

  fs.writeFile(ROOT + folder + '/' + file, buf, (e) => {
    if (e)
    {
      console.log(e);
      u.send_json(200, {api: 'Upload', status: 'ERROR', msg: 'upload failed'}, this.res);
    }
    else
    {
      u.send_json(200, {api: 'Upload', status: 'OK'}, this.res);
    }
  });
}

(() => {
  if (!fs.existsSync(__dirname + '/../www/content/users/')){
    fs.mkdirSync(__dirname + '/../www/content/users/', { recursive: true });
  }
  if (!fs.existsSync(__dirname + '/../www/content/foxpad/')){
    fs.mkdirSync(__dirname + '/../www/content/foxpad/', { recursive: true });
  }  
})();

module.exports = { index };