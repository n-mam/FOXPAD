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
 <input type="checkbox" name="debug" value="Debug" onclick="onDebug()">
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

module.exports = { 
  send_html, 
  send_json, 
  isDefined,
  isString,
  setJSONvalues,
  DEBUG, 
  validateKeyValue, 
  row, 
  trimNullProps
};