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
       <link rel="stylesheet" href="js/metro-ui-css/css/metro-all.min.css">
       ${css.main(v.page)}
     </head>
     <body class="m4-cloak h-vh-100">
       ${content(v)}
       <script src="js/metro-ui-css/js/metro.min.js"></script>
       ${postJS()}
     </body>
  </html>`;
}

var content = (v) =>
{
  if (u.isDefined(v.json.prv.user))
  {
    return `
    <div class="compacted js-compact p-2"
         data-role="navview" 
         data-compact="md" 
         data-expand="md" 
         data-toggle="#pane-toggle" 
         data-active-state="true">

      <nav class="navview-pane" style="">

         <button class="pull-button">
             <span class="mif-menu"></span>
         </button>
   
         <ul class="navview-menu">
             <li class="active">
                 <a href="#id-home">
                     <span class="icon"><span class="mif-home"></span></span>
                     <span class="caption">Home</span>
                 </a>
             </li>
   
             <li class="item-separator"></li>
   
             <li>
                 <a href="#id-cameras" class="">
                     <span class="icon"><span class="mif-video-camera"></span></span>
                     <span class="caption">Cameras</span>
                 </a>
             </li>
   
             <li class="item-separator"></li>
   
             <li>
                 <a href="#id-agents" class="">
                     <span class="icon"><span class="mif-display"></span></span>
                     <span class="caption">Agents</span>
                 </a>
             </li>
   
             <li class="item-separator"></li>
   
             <li>
                 <a href="#id-alerts">
                     <span class="icon"><span class="mif-warning"></span></span>
                     <span class="caption">Alerts</span>
                     <div class="badges">
                         <span class="badge inline">10</span>
                         <span class="badge inline">5</span>
                     </div>
                 </a>
             </li>
   
             <li class="item-separator"></li>
   
             <li>
                 <a href="#id-reports">
                     <span class="icon"><span class="mif-chart-line"></span></span>
                     <span class="caption">Reports</span>
                 </a>
             </li>
   
             <li class="item-separator"></li>
   
             <li>
                 <a href="#" class="dropdown-toggle">
                     <span class="icon"><span class="mif-user"></span></span>
                     <span class="caption">${v.json.prv.user.name}</span>
                 </a>
                 <ul class="navview-menu" data-role="dropdown">
                  <li class="bg-white">
                    <a href="#">
                     <span class="icon"><span class="mif-profile"></span></span>
                     <span class="caption">Profile</span>
                    </a>
                  </li>
                  <li class="bg-white">
                    <a href="#" onclick="_auth('LOGOUT')">
                     <span class="icon"><span class="mif-exit"></span></span>
                     <span class="caption">Sign out</span>
                    </a>
                  </li>
                 </ul>
             </li>
         </ul>
    </nav>
  
     <div class="navview-content h-100 text-center">
       <div id="content-wrapper" class="content-inner h-100" style="overflow-y: auto;scroll-behavior: smooth;">
         ${v.page.html}
         ${u.DEBUG()}
       </div>
     </div>
   </div>
    `;
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
    <div class="flex column">
      <img style='' src='/image/architecture.png' alt='logo'>
    </div>
    <div class="flex column pl-5">
      ${cred.credentials()}
      <a class="pt-4" href="/content/foxpad/fpd.zip">
        <button class="button rounded"><span class="pr-2 mif-download mif-2x icon"></span><b>AGENT</b></button>
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
