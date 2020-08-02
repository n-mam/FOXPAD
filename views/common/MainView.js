var u = require('../../lib/util');
var cred = require('./Credentials');
var css = require('./CSS');

var render = (v) =>
{
  return `
  <!DOCTYPE html>
   <html lang='en'>
     <head>
       <title>${v.page.title}</title>
       <meta charset="utf-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
       ${preJS()}
       <!-- Metro 4 -->
       <link rel="stylesheet" href="js/metro-ui-css/css/metro-all.min.css">
       ${css.main(v.page)}
     </head>
     <body>
       ${u.isDefined(v.json.prv.user) ? Header(v) : ''}
       ${content(v)}
       <script src="js/metro-ui-css/js/metro.min.js"></script>
       ${postJS()}
     </body>
  </html>`;
}

var content = (v) =>
{
  if (u.isDefined(v.page.html.left) ||
      u.isDefined(v.page.html.center) ||
      u.isDefined(v.page.html.right))
  {
    return `
    <div class="container-fluid text-center pt-16">
      <div class="d-flex flex-row ">
        <div class="grid cell-2" id="main-view-left">
          ${expandRows(v.page.html.left)}
        </div>
        <div class="grid cell-5" id="main-view-center">
          ${expandRows(v.page.html.center)}
        </div>
        <div class="grid cell-5" id="main-view-right">
          ${expandRows(v.page.html.right)}
          <div class="row">${u.DEBUG()}</div>   
        </div>
      </div>
    </div>`;
  }
  else
  {
    return landingPage();
  }
}

var expandRows = (l) => 
{
  let h = ``;

  if (u.isDefined(l))
  {
    for (let i = 0; i < l.length; i++)
    {
      h += `<div class="row">${l[i]}</div>`;
    }
  }

  return h;
}

var preJS = () =>
{
  return `
  <script>
    function isDefined(v) 
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
    var initActions = [];
    var windowOnLoadCbk = [];
    var MessageListeners = [];
  </script>`;
}

var postJS = () => 
{
 return `
  <script src='/js/main.js'></script>
  <script src='/js/ws.js'></script>`;
}

function landingPage()
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
  ${u.DEBUG()}`;
}

var Header = ({page, json}) =>
{
  let {name, email, image = '/image/profile.png'} = json.prv.user;

  return `
  <div class="container-fluid pos-fixed fixed-top z-top">
  <header class="app-bar fg-black app-bar-expand" data-role="appbar" data-expand="true" data-role-appbar="true">
    ${css.spacer(4, 'h-spacer')}
    <div class='flex' style='cursor:pointer'>
      <img style='' src='/image/fox1.png' alt='logo' width='28' height='28'>
      ${css.spacer(2, 'h-spacer')}
      <b>${page.title}</b>
    </div>
    ${css.spacer(4, 'h-spacer')}
    <div class="app-bar-menu ml-auto">
     <li>
      <a href="#" class="dropdown-toggle" style="font-weight:bold;">
       <img src="${image}" width=28 height=28> ${name}
      </a>
      <ul class="d-menu place-right" data-role="dropdown">
       <li><a href="#">Windows 10</a></li>
       <li><a href="#">Profile</a></li>
       <li class="divider bg-lightGray"></li>
       <li><a href="#" onclick="_auth('LOGOUT')">Sign out</a></li>
      </ul>
     </li>
    </div>
    ${css.spacer(4, 'h-spacer')}
  </header>
  </div>
  `;
}

var getView = (context) => 
{
  if (!u.isDefined(context.view))
  {
    context.view =  {
      page: {
        title: `FOXPAD`,
        nav: ``,
        html: {},
        theme: 'white',
        accordian: '#29a3a3'
      },
      json: {
        prv: {},
        pub: {}
      },
      context: context,
      e: undefined,
      finalize: false,
      pushJSON: function(key, value) {
        this.context.view.json.pub[key] = value;
      },
      getJSON: function(key) {
        return this.context.view.json.pub[key];
      },
      user: function() {
        return this.context.view.json.prv.user;
      },
      isSU: function() {
        return this.context.view.json.prv.user.isSuper;
      },
      setError: function(e) {
        this.context.view.page.html.center = [e];
        this.context.view.send();
      },
      setStatus: function(type, message) {
        this.context.view.json.pub['status'] = type;
        this.context.view.json.pub['message'] = message;
        this.context.view.send();
      },
      setUserData: function(data) {
        this.context.view.json.prv = data;
        this.context.view.applyAppUIStyles();
      },
      type: function(){
        let type = this.context.params.get('response');
        if (u.isDefined(type))
        {
          return type;
        }
        else
        {
          return '';
        }
      },
      applyAppUIStyles: function() {
        if (this.context.view.isSU())
        {
          this.context.view.page.theme = 'white';
          this.context.view.page.accordian = '#29a3a3'; 
        }
        else
        {
          this.context.view.page.theme = 'white';
          this.context.view.page.accordian = '#29a3a3';
        }
      },
      send: function() {
        if (this.context.view.type() === 'json')
        {
          this.context.view.sendjson();
        }
        else
        {
          this.context.view.sendhtml();
        }    
      },
      sendhtml: function() {
        u.send_html(this.context.res, render(this));
      },
      sendjson: function() {
        u.send_json(
          200,
          u.isDefined(this.context.view.json.pub) ? this.context.view.json.pub : {},
          this.context.res);
      }
    };
  }

  return context.view;
}

module.exports = { render, getView };
