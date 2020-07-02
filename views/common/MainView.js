var u = require('../../lib/util');
var css = require('./CSS');
var content = require('./Content');

var render = (v) =>
{
  return `
   <!doctype html>
   <html lang='en'>
    <head>
     <title>${v.page.title}</title>
     <meta charset="UTF-8">
     <meta name='viewport' content='width=device-width, initial-scale=1.0'>
     ${preJS()}
     ${css.main(v.page)}
    </head>
    <body>
      ${u.isDefined(v.json.prv.user) ? Header(v) : ''}
      <div style='width:100%;height:2%;'> </div>
      ${content.render(v)}
      ${postJS()}
    </body>
   </html>`;
}

var Header = ({page, json}) =>
{
 return `
 <div class='flex header'>
  <div class='flex left' style='justify-content:center' onclick="window.location='/';">
    <div class='flex' style='font-size:1.1em;letter-spacing:0.4em;cursor:pointer'>
      <img style='' src='/image/fox1.png' alt='logo' width='32' height='32'>
      ${css.nbsp(2)}
      <b>${page.title}</b>
    </div>
  </div>
  <div class='flex center' style='letter-spacing: 0.15em;justify-content:flex-end;'>

  </div>
  <div class='flex right' style='justify-content:center'>
    ${profile(json.prv.user)}
  </div>
 </div>`;
}

var profile = (user) => 
{
  let html = ``;

  if (u.isDefined(user))
  {
    let {name, email, image = '/image/profile.png'} = user;

    html = `
     ${css.profile()}
     <div id='profile' class='flex column'>
       <div class='flex'>
         <img src=${image} alt='user' width='24' height='24'>
         <b style='margin:0.3em'>${u.isDefined(name) ? name : email}</b>
       </div>
       <div id='menu' class='flex column'>
         <div class='h-line' style="width:65%"></div>
            <div id='menu-profile' class='flex menu-item' onclick="window.location='/User/show?id=${user.id}';">
              <b>PROFILE</b>
            </div>
            <div class='h-line' style="width:65%"></div>
            <div id='menu-logout' class='flex menu-item' onclick="_auth('LOGOUT')">
              <b>LOGOUT</b>
            </div>
         </div>
       </div>`;
  }
  
  return html;
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
