 var fs = require('fs');
 var path = require('path');
 var mime = require('mime');
 var throttle  = require('throttle');
 var oppressor = require('oppressor');

 var u = require('./util');

 var handlers = {};

 var clear = () => {
   handlers = {};
 }

 var setHandler = (url, controller) => 
 {
   handlers[url] = controller;
 }

 var getHandler = (url, req, res, cookie) => 
 {
   let tokens = url.pathname.split('/');
   
   let route = '/' + tokens[1];

   let controller = handlers[route];

   if (u.isDefined(controller))
   {
     let context = 
       {
         params : url.searchParams,
         path : url.pathname,
         req : req,
         res : res,
         cookie : cookie
       };
     
     let f = url.pathname.split(route + '/')[1];

     if (!u.isDefined(f))
     {
       return controller['index'].bind(context);
     }
     if (u.isDefined(controller[f]))
     {
       return controller[f].bind(context); 
     }
     else
     {
       return controller['index'].bind(context);
     }
   }

   return null;
 }

 var defaultHandler = (req, res, path) =>
 {
   read_static(req, res, __dirname + '/../www' + path);
 }

 var read_static = (request, response, file) =>
 {
   var contentType = mime.lookup(path.extname(file));
   /*
    * console.log(request.method + " mime : " + contentType + " file : " + path);
    */
   var stat = null;

   try
   {
     stat = fs.statSync(file);
   }
   catch (e)
   {
     u.send_html(response, '<b>File Not Found.</b>');
     console.log(e.message);
     return;
   }
   /**
    * cache everything except mp3's for 1 hour, webp for a day
    */
   var age = 0;
   
   if (file.endsWith('.otf') || file.endsWith('.ttf'))
   {
     age = 3600 * 24 * 1;
     // Website you wish to allow to connect
     response.setHeader('Access-Control-Allow-Origin', '*');

     // Request methods you wish to allow
     response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

     // Request headers you wish to allow
     response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

     // Set to true if you need the website to include cookies in the requests sent
     // to the API (e.g. in case you use sessions)
     response.setHeader('Access-Control-Allow-Credentials', true);
   }
   else
   {
     age = 3600 * 0;
   }

   response.setHeader('Cache-Control', 'public, max-age=' + age.toString());

   response.setHeader('content-type', contentType);

   var total = stat.size;

   if (request.headers.range) 
   {
     var range = request.headers.range;
     var parts = range.replace(/bytes=/, "").split("-");
     var partialstart = parts[0];
     var partialend = parts[1];

     var start = parseInt(partialstart, 10);
     var end = partialend ? parseInt(partialend, 10) : (total - 1);
     var chunksize = (end - start) + 1;

     console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);

     response.statusCode = 206;
     response.setHeader('Content-Range', 'bytes ' + start + '-' + end + '/' + total);
     response.setHeader('Accept-Ranges', 'bytes');
     response.setHeader('Content-Length', chunksize);
   }
   else
   {
     response.statusCode = 200;
     response.setHeader('Content-Length', total);
   }

   var stream = fs.createReadStream(file, {start: start, end: end});

   stream.on('error', (e) => {
     console.log('stream on error : ' + e);
     response.writeHead(500);
     response.end();
   });

   stream.on('end', (e) => {
     /*console.log('stream ended');*/
   });

   stream.on('close', (e) => {
     /*console.log('stream closed');*/
   });

   if (file.endsWith('.m4a'))
   { /**
      * create a "Throttle" instance that reads at 1 bps
      */
     var t = new throttle(1024*60);
     stream.pipe(t).pipe(response);
   }
   else
   {
     stream.pipe(oppressor(request)).pipe(response);
   }
 }

 module.exports = { clear, setHandler, getHandler, defaultHandler };