var u = require('../../lib/util');
var css = require('./CSS');
var content = require('./Content');

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
     <link rel="stylesheet" href="js/metro-ui-css/css/metro.min.css">
     <link rel="stylesheet" href="js/metro-ui-css/css/metro-colors.min.css">
     <link rel="stylesheet" href="js/metro-ui-css/css/metro-rtl.min.css">
     <link rel="stylesheet" href="js/metro-ui-css/css/metro-icons.min.css">    
     ${css.main(v.page)}
    </head>
    <body>
      ${u.isDefined(v.json.prv.user) ? Header(v) : ''}
      ${content.render(v)}
      ${postJS()}
      <script src="js/metro-ui-css/js/metro.min.js"></script>
    </body>
   </html>`;
}

var Header = ({page, json}) =>
{
  let {name, email, image = '/image/profile.png'} = json.prv.user;

  return `
  <div class="container-fluid pos-fixed fixed-top z-top">
  <header class="app-bar fg-black app-bar-expand" data-role="appbar" data-expand="true" data-role-appbar="true">
    ${css.spacer(4, 'h-spacer')}
    <div class='flex' style='cursor:pointer'>
      <img style='' src='/image/fox1.png' alt='logo' width='32' height='32'>
      ${css.spacer(2, 'h-spacer')}
      <b>${page.title}</b>
    </div>
    ${css.spacer(4, 'h-spacer')}
    <div class="app-bar-menu ml-auto">
     <li>
      <a href="#" class="dropdown-toggle">
       <img src="${image}" width=32 height=32> ${name}
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

var navigation = (merchant, branch) => 
{
  return `
    <div class='flex column' style='cursor:pointer;width:auto' onclick="location.href='/';">
     <p>
      <b style='color:mediumblue'>Home</b>
     </p>
    </div>
    ${u.isDefined(merchant) ?
     `${css.nbsp(5)}>>${css.nbsp(5)}
      <div class='flex column' style='cursor:pointer;width:auto' onclick="location.href='/Merchant/show?id=${merchant.id}';">
      ${css.spacer(0)}
      <p>
        <b style='color:mediumblue'>${merchant.name}</b>
      </p>
     </div>` : ``}
    ${u.isDefined(branch) ?
     `${css.nbsp(5)}>>${css.nbsp(5)}
      <div class='flex column' style='cursor:pointer;width:auto' onclick="location.href='/Branch/show?id=${branch.id}&mid=${merchant.id}';">
        ${css.spacer(0)}
        <p>
         <b style='color:mediumblue'>${branch.name}</b>
        </p>
      </div>` : ``}`;
}

var preJS = () =>
{
  return `
   <script>
    var isDefined = (v) => {
     if (v === null || typeof v === 'undefined') {
      return false;
     }
     else {
      return true;
     }
    }
    var windowOnLoadCbk = [];
    var initActions = [];
    var MessageListeners = [];
   </script>  
  `;
}

var postJS = () => 
{
  return `<script src='/js/main.js'></script>`;
}

var message = (m) => 
{
  console.log(m);
  return `
   <div class='flex column' style=''>
    <p><b>${m}</b></p>
   </div>`;
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

module.exports = { render, message, getView, navigation };
