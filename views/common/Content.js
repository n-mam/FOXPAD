var u = require('../../lib/util');
var css = require('../common/CSS');
var cred = require('./Credentials');

var common = () => { 
 return `
   #content {
     width: 100%;
     height: 87%;
     text-align: center;
   }
   #flash {
     width: 50%;
     display: none;
     min-height: auto;
   }`;
}
var style_h = (v) => 
{
  return `
   <style>
    ${common()}
   </style>`;
}

var horizontal = (v) => 
{
  return `
   ${style_h(v)}
   <div id='content' class='flex'>
    <div id='left' class='flex column left'>
     ${u.isDefined(v.page.html.left) ? v.page.html.left : '<!--p>LEFT</p-->'}
    </div>
    <div id='center' class='flex column center'>
     ${u.isDefined(v.page.html.center) ? v.page.html.center : '<p>CENTER</p>'}
     ${css.spacer(2)}
     <div id='flash' class='flex error'>
      <b>ERROR</b>
     </div>
     ${u.DEBUG()}
    </div>
    <div id='right' class='flex column right'>
     ${u.isDefined(v.page.html.right) ? v.page.html.right : '<!--p>RIGHT</p-->'}
    </div>
  </div>`;
}

var style_v = (v) => 
{
  return `
   <style>
    ${common()}
    #top, #bottom {
      width: 100%;
    }
    #top {
      height: ${u.isDefined(v.json.prv.user) ? '5%;' : '45%;' }
    }
    #bottom {
      justify-content: flex-start;
      height: ${u.isDefined(v.json.prv.user) ? '95%;' : '55%;' }
    }
   </style>`;
}

var vertical = (v) => 
{
  return `
   ${style_v(v)}
   <div id='content' class='flex column'>
     <div id='top' class='flex'>
       ${u.isDefined(v.page.html.top) ? v.page.html.top : ''}
     </div>
     <div id='bottom' class='flex column'>
      ${u.isDefined(v.page.html.bottom) ? v.page.html.bottom : ''}
      ${css.spacer(2)}
      <div id='flash' class='flex error'>
       <b>ERROR</b>
      </div>
      ${u.DEBUG()}
     </div>
   </div>`;
}

function LandingPage()
{
  return `
  <div class='flex row' style='width:100%;height:75%;'>
   <img style='' src='/image/architecture.png' alt='logo' >
   ${css.nbsp(10)}
   <div class='flex column'>
    ${cred.credentials()}
    ${css.spacer(5)}
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