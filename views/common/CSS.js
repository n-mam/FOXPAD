var main = ({theme, accordian}) => { 
 return `
 <style>
 :root {
  --main-color: ${theme};
  --border-color: #a7a7a7;
  --accordian-color: ${accordian};
  --accordian-child-color: #397fa1;
 }
 html, body {
  height: 100%;
  padding: 0px;
  margin: 0px;
  letter-spacing: 0.1em;
 }
 body {
  position: absolute;
  min-width: 100%;
  min-height: 100%;
  user-select: none;
  overflow: hidden;
  font-size: 0.75em;
  font-family: 'Quicksand', sans-serif;
 }
 .hide-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
 }
 .hide-scroll::-webkit-scrollbar {
   display: none;
 }
 ::-webkit-scrollbar-thumb {
  background: #F6ECEA;
 }
 div {
  display: block;
 }
 .h-line {
  display: inline-flex;
  height: 1px;
  border-top: 1px solid #ccc;
  width: 100%;
 }
 .v-spacer {
  width: 100%;
  height: 0.7em;
 }
 .h-spacer {
  width: 0.7em;
  height: 100%;
 }
 .flex {
  display: inline-flex;
  align-items: center;
  justify-content: center;
 }
 a, u {
  text-decoration: none;
 }
 .column {
  flex-direction: column;
 }
 .error {
  color: black;
  text-align: center;
  background-color: #ffa7a7;
  border-radius: 0.15em;
  padding: 0.5em;
 }
 .button {
  padding: 0.5em;
  border-radius: 0.15em;
  border: 1px solid #a5a5a5;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
 }
 select {
   font: inherit;
 }
 .button:hover, .button:focus {
  background-color: whitesmoke;
 }
 button::-moz-focus-inner {
  border: 0;
 }
 .action {
  color: #545454;
  width: auto;
 }
 p { 
  margin: 0em;
 }
 fieldset {
  padding: 1.5em;
  border-radius: 0.3em;
  border: 1px solid var(--border-color);  
 }
 .dialog {
  width: auto;
  height: auto;    
  padding: 1em;
  border-radius: 0.3em;
  letter-spacing: 0.1em;
  border: 1px solid #a5a5a5;
 }
 input[type="text"] {
  cursor: text;
 }
 input[type="checkbox"] {
  cursor: pointer;
 } 
 input[type="file"] {
  display: none;
 }
 .header-menu {
   cursor: pointer;
 }
 .header-menu .h-line {
  display:none;
} 
 .header-menu:hover .h-line {
   display:block;
 }
 input[type=text], input[type=password] {
  border: none;
  outline: none;
  border-bottom: 1px solid #a1a1a1; 
  background: transparent;
  font-family: 'Quicksand';
  text-align:center;
  font-weight: bold;
  height: 2.5em;
 }
 select {
  text-align-last: center;
  display: block;
  font-family: inherit;
  padding: .3em 1.5em .3em .5em;
  max-width: 100%;
  box-sizing: border-box;
  border: 1px solid #aaa;
  box-shadow: 0 1px 0 1px rgba(0,0,0,.04);
  border-radius: .3em;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-color: #fff;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
  linear-gradient(to bottom, #ffffff 0%,#e5e5e5 100%);
  background-repeat: no-repeat, repeat;
  background-position: right .4em top 50%, 0 0;
  background-size: .65em auto, 100%;
} 
 .link {
  cursor: pointer;
 }
 .menu-item {
  border-radius: 0.15em;
  height: 1.7em;
 }
 .menu-item:hover, .menu-item:focus {
  box-shadow: 1px 1px 2px 2px rgba(0,0,0,0.3);
 }
 *:focus {
  outline: none;
 }
 @font-face {
  font-family: Quicksand;
  src: url(/fonts/Quicksand/Quicksand-Regular.ttf);
 }
 .header {
  width: 100%;
  height: 8%;
  /*box-shadow: 0 2px 10px rgba(0,0,0,.25);
  background-color: var(--main-color);*/
 } 
 .left, .right, .center {
  height: 100%;
  justify-content: flex-start;
 }
 .left {
  width:15%;
 }
 .center {
  overflow: auto;
  width:70%;
 }
 .right {
  width:15%;
 }
 </style>
`;
}

var profile = () => 
{
 return `
  <style>
   #profile {
    position: relative;
    padding: 0.3em;
    border-radius: 0.3em;
    min-width: 8em;
    border: none;
    cursor: pointer;
   }
   #profile div {
    width: 100%;
   }
   #profile img {
   }
   #menu {
    position:absolute;
    top: 2.4em;
    display: none;
   }
   #profile:hover {
    background-color: #f9f8f8;
   }
   #profile:hover #menu {
    background-color: #f9f8f8;
    display: inline-flex;
   }
  </style>
 `;
}

var ll = () => { return `
<style>
 #ll {
   z-index: 7;
   margin-left: 1em;  
   border-radius: 5%;
   border: 1px solid #a5a5a5;
 }
 #ll-s {
   color: #545454;
 }
</style>
 `;
}

var spacer = (multiplier = 1, direction = 'v-spacer') =>
{
  let html = ``;
  for(let i = 0; i < multiplier; i++)
  {
    html += `<div class='${direction}'></div>`;
  }
  return html;
}

var nbsp = (multiplier = 2) =>
{
  let html = ``;
  for (let i = 0; i < multiplier; i++)
  {
    html += `&nbsp;`;
  }
  return html;
}


module.exports = { main, profile, ll, spacer, nbsp };