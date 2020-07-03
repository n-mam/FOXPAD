function getCookie(req, k = 'BH')
{
  let result;
  let cookies;
  
  if (typeof window === 'undefined')
  { /** node */
    if (typeof req.headers.cookie != 'undefined' && 	
        req.headers.cookie != '')	
    {
      cookies = req.headers.cookie.split(';')
    }
  }
  else
  { /** browser */
    cookies = document.cookie.split(';');
  }

  if (typeof cookies != 'undefined')
  {
    cookies.forEach(cookie => {
      let [key, value] = cookie.split('=');
      if (key.trim() === k)
      {
        result = value;
      }
    })
  }

  return result;
}

function getPathCookie(cookie, v)
{
  let json = {};

  let value = getCookie(v.context.req, cookie);

  if (isDefined(value))
  {
    json = JSON.parse(value);
  }

  return json[v.context.path];
}

var send_json = (code, j, res) =>
{
  res.writeHead(code, {'Content-Type': 'application/json'}); 

  res.write(JSON.stringify(j));

  res.end();
}

var send_html = (res, html) =>
{
  res.writeHead(200, {'Content-Type': 'text/html'});

  res.write(html);

  res.end();
}

var isString = (v) =>
{
  if (isDefined(v))
  {
    if (typeof v === 'string')
    {
      if (v.length)
      {
        return true;
      }
    }
  }
  return false;
}

var trimNullProps = (o) => 
{
  for (const [key, value] of Object.entries(o))
  {
    if (value === null)
    {
      delete o[key];
    }
  }
  return o;
}

var isDefined = (v) =>
{
  if (v === null || typeof v === 'undefined')
  {
    return false;
  }
  else
  {
    return true;
  }
}

/*
 * works for both mid and bid
 */
var isAdminfor = ({name, value}, admins) =>
{
  let fRet = false;

  if (admins.length)
  {
    admins.forEach(element => {
      if (element[name] == value)
      {
        fRet = true;
      }
    });
  }

  return fRet;  
}

var contentEdit_script = () => { return `
  function onFocus(e)
  {
    if (!isDefined(e.orgContent))
    {
      e.orgContent = e.textContent.trim();
    }
  }
  function onEdit(e, key, id, t)
  {
    if (e.orgContent !== e.textContent.trim())
    {
      _crud({ action: 'UPDATE', table: t, rows: [{id, [key]: e.textContent.trim()}] });
    }
  }
`;
}

function contentEdit (key, id, table) 
{ 
  return (isDefined(this.edit) && this.edit) ?
            `onfocus='onFocus(this)' 
             onblur="onEdit(this, '${key}', '${id}', '${table}')" 
             contenteditable='true'` 
             : 
             ``;
}

var row = (cells) => {

  let n = cells.length;

  let html = `<div class='flex' style='width:100%'>`

  for (let i = 0; i < n; i++)
  {
    html += `<div class='flex' style='width:${100/n}%'>
               ${cells[i]}
             </div>`;
  }

  html += `</div>`;

  return html;
}

var setJSONvalues = (v, results) =>
{
  let i = 0;
  for (const [key, value] of Object.entries(v.json.pub))
  {
    if (value === '')
    {
      v.pushJSON(key, results[i++]);
    }
  }
}

var DEBUG = () => {  return `
 <script>
  function onDebug() {
    const demoClasses = document.querySelectorAll('div');
    demoClasses.forEach(element => {
      if (element.style.border === 'none' || element.style.border === '')
        element.style.border = '1px dashed red';
      else
        element.style.border = '';
    });
  }
 </script>
 <br><br>
 <div class='flexx'>
   <input type="checkbox" name="debug" value="Debug" onclick="onDebug()">
 </div>
`;
}

var validateKeyValue = (k, v) => {

 let fRet = true;

 if (k.length === v.length)
 {
   for (let i = 0; i < k.length; i++)
   {
     if ((typeof k[i] !== 'string') || 
         (typeof v[i] !== 'string'))
     {
       fRet = false;
     }
   }
 }

 return fRet;
}

module.exports = { getCookie,
                   getPathCookie,
                   send_html, 
                   send_json, 
                   isDefined,
                   isAdminfor,
                   isString,
                   setJSONvalues,
                   DEBUG, 
                   validateKeyValue, 
                   row, 
                   trimNullProps, 
                   contentEdit, 
                   contentEdit_script};