var http = require("http");
var URL = require('url').URL;
/**
 *  library
 */
var router = require('./lib/router');
var APIController = require('./lib/api');
var u = require('./lib/util');

/** 
 * controllers
 */
var HomeController = require('./control/HomeController');
var DashBoardController = require('./control/DashBoardController');
var UserController = require('./control/UserController');
var FileController = require('./control/FileController');

/**
 * command line defaults
 */
var port = 8080;
var dbname = "foxpad";

/**
 * node.exe server.js 1234 dbname
 */
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

var reqListener = (req, res) => 
{
  const { headers, method, url } = req;

  var cookie = u.getCookie(req);

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

  const cbk_error = (e) =>
  {
    console.error(error);
  }

  var body = [], total = 0;

  const cbk_data = (chunk) => 
  {
    total += chunk.length;

    console.log('new chunk ' + chunk.length + ' total : ' + total);
    /**
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
  };

  const cbk_end = () =>
  {
    console.log('Total chunks recieved ' + body.length.toString());

    if (_url.pathname !== '/upload') //todo: check req's content type
    {
      body = Buffer.concat(body).toString();
    }
    else
    {
      body = Buffer.concat(body);
    }
    /**
     * At this point, we have the headers, method, url and body, and
     * can now do whatever we need to in order to respond to this req.
     */
    if (handler)
    {
      if (method == 'POST') 
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
      else if (method == 'GET')
      {
        console.log(method + ", " + _url.pathname + ", " + _url.search + " ");
        console.log('accordion : ' + JSON.stringify(u.getCookie(req, 'accordion')));
        console.log('BH : ' + JSON.stringify(u.getCookie(req, 'BH')));
        handler(); 
      }
    }
    else
    {
      router.defaultHandler(req, res, _url.pathname);
    }
  };

  req.on('error', cbk_error);
  req.on('data', cbk_data);
  req.on('end', cbk_end);

  try
  {
    var _url = new URL(url, 'https://example.org/');
  }
  catch (e)
  {
    console.log('failed to parse request url');
    abortRequest(req, res, 'Invalid URL');
    return;
  }

  var handler = router.getHandler(_url, req, res, cookie);  
}

(http.createServer(reqListener)).listen(port);

console.log(" server   : http://localhost:" + port.toString());