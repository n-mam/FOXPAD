var css = require('../common/CSS');

var style = () => { return `
 <style>
  #auth {
    background-color: white;
    -webkit-box-shadow: 11px 10px 17px -13px rgba(0,0,0,1);
    -moz-box-shadow: 11px 10px 17px -13px rgba(0,0,0,1);
    box-shadow: 11px 10px 17px -13px rgba(0,0,0,1);    
  }
  #FB, #GP {
    width: 7.5em;  
    height: 1.5em;
    margin: 0.8em;
    padding-left: 0.5em;
    padding-right: 0.5em;
    color: white;
  }
  #FB {
    background-color: #3b5998;
  }
  #GP {
    background-color: #E74C3C;
  }
 </style>`;
}

var credentials = () => { return `
 ${style()}
 <div id='auth' class='flex column dialog' style='min-width:17em;'>
   <div class='flex' style='font-size:1.1em;letter-spacing:0.4em;cursor:pointer'>
     <img style='' src='/image/fox1.png' alt='logo' width='32' height='32'>
     ${css.nbsp(1)}
     <b>FOXPAD</b>
   </div>   
  <!--div class='flex'>
   <div id='GP' class='flex button'>
    <b>GOOGLE</b>
   </div>
   <div id='FB' class='flex button'>
    <b>FACEBOOK</b>
   </div>
  </div-->
  ${css.spacer(1)}
  <div class='flex column'>
   <div>
    <input id='email' type='text' placeholder='USER' style='text-align:center;' tabindex="1" autocomplete="off"> 
   </div>
   ${css.spacer(1)}
   <div>
    <input id='password' type='password' placeholder='PASSWORD' style='text-align:center;' tabindex="2">
   </div>
  </div>
  ${css.spacer(3)}
  <div class='flex'>
   <div id='btn-signup' class='flex button action' onclick='_auth("SIGNUP")' style='display:none;min-width:4.5em;' tabindex="3">
    <b>SIGNUP</b>
   </div>
   <div id='btn-login' class='flex button action' onclick='_auth("LOGIN")' style='display:inline-flex;min-width:4.5em;' tabindex="3">
    <b>LOGIN</b>
   </div>
  </div>
  ${css.spacer(2)}
  <div id='l-toggle' tabindex="3">
    New user ? <b class='link' style="color:blue;border-bottom:solid 1px blue;padding:0.1em;cursor:pointer;" onclick='toggleaction()'>SIGNUP</b>
  </div>
 </div>`;
}

module.exports = { credentials };