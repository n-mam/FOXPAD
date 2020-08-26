var http = require("http");
var URL = require('url').URL;

var u = require('./lib/util');
var router = require('./lib/router');
var APIController = require('./lib/api');

var HomeController = require('./control/HomeController');
var DashBoardController = require('./control/DashBoardController');
var UserController = require('./control/UserController');
var FileController = require('./control/FileController');

var port = 8080;
var dbname = "foxpad";

if (process.argv.length >= 3)
{
  port = parseInt(process.argv[2]);
}

if (process.argv.length >= 4) 
{
  dbname = process.argv[3];
}

console.log(process.env['NODE_PATH']);
console.log(" port     : " + port.toString());
console.log(" database : " + dbname);

router.setHandler('/', HomeController);
router.setHandler('/User', UserController);
router.setHandler('/api', APIController);
router.setHandler('/upload', FileController);

var abortRequest = (req, res, m) =>
{
  console.log('aborting request');
  req.removeListener('data', cbk_data);
  req.removeListener('end', cbk_end);
  /*
   * with the "Connection close" header set 
   * node will automatically close the socket
   */
  res.setHeader('Connection', 'close');

  u.send_json(
    413, 
    {
      status: 'ERROR',
      msg: m
    },
    res);

  console.log('request connection destroyed');
}

http.createServer((req, res) => {

  const { headers, method, url } = req;

  let cookie = u.getCookie(req);

  let body = [], handler, _url;

  try
  {
    _url = new URL(url, 'https://example.org/');
    handler = router.getHandler(_url, req, res, cookie);
  }
  catch (e)
  {
    console.log('failed to parse request url');
    abortRequest(req, res, 'invalid url');
    return;
  }

  req.on('error', (e) => {

    console.error(error);

  }).on('data', (chunk) => {

    console.log('chunk len : ' + chunk.length + ' total : ' + body.length);
    /*
     * except for upload route, limit the body size to 1K todo
     */
    if ((cookie === null) && (_url.pathname !== '/upload') && (total >= 1024))
    {
      abortRequest(req, res, 'max data exceeded');
    }
    else
    {
      body.push(chunk);
    }

  }).on('end', () => {

    if (_url.pathname !== '/upload') //todo: check req's content type
    {
      body = Buffer.concat(body).toString();
    }
    else
    {
      body = Buffer.concat(body);
    }

    console.log(`req ${_url.pathname} end. body len : ${body.length}`);

    /*
     * At this point, we have the headers, method, url and body, and
     * can now do whatever we need to in order to respond to this req.
     */
    if (handler)
    {
      if (method === 'POST') 
      {
        var jb = null;

        try
        {
          jb = JSON.parse(body);

          handler(jb);
        }
        catch (e)
        {
          handler(body);
        }
      }
      else if (method === 'GET')
      {
        console.log(method + ", " + _url.pathname + ", " + _url.search + " ");
        console.log('BH : ' + JSON.stringify(u.getCookie(req, 'BH')));
        handler();
      }
    }
    else
    {
      router.defaultHandler(req, res, _url.pathname);
    }

  });

}).listen(port);

console.log(" server   : http://localhost:" + port.toString());