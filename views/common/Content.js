var u = require('../../lib/util');
var css = require('../common/CSS');
var cred = require('./Credentials');

var horizontal = (v) =>
{
  return `
   <div class="container-fluid text-center pt-16">
     <div class="grid">
       <div class="row">
         <div class="cell-2"><div class="">${v.page.html.left}</div></div>
         <div class="cell-7"><div class="">${v.page.html.center}</div></div>
         <div class="cell-3"><div class="">${v.page.html.right}</div></div>
       </div>
     <div class="row">${u.DEBUG()}</div>        
   </div>

   <div>
     <div id='flash' class='flex error'>
      <b>ERROR</b>
     </div>     
   </div>`;
}

function LandingPage()
{
  return `
  <div class="flex row pos-fixed pos-center">
    <img style='' src='/image/architecture.png' alt='logo'>
    ${css.spacer(6, 'h-spacer')}
    <div class="flex column">
    ${cred.credentials()}
    ${css.spacer(6)}
    <a href="/content/foxpad/Foxpad-1.0.0-win64.exe">
     <div id='btn-download' class='flex button action' style='background-color:var(--accordian-color);color:white;min-width:10em;padding:0.5em;'>
      <b>DOWNLOAD</b>
     </div>
    </a>
   </div>
  </div>
  ${u.DEBUG()}
  `;
}

var render = (v) =>
{
  if (u.isDefined(v.page.html.left) ||
      u.isDefined(v.page.html.center) ||
      u.isDefined(v.page.html.right))
  {
    return horizontal(v);
  }
  else if (u.isDefined(v.page.html.top) || 
           u.isDefined(v.page.html.bottom))
  {
    return vertical(v);
  }
  else
  {
    return LandingPage();
  }
}

module.exports = { render };