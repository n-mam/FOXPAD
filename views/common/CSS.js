var main = ({theme, accordian}) => { 
 return `
 <style>
 html {
  height: 100%;
}

 body {
  height: 100%;
  font-family: 'Quicksand', sans-serif;
 }
 .h-line {
  display: inline-flex;
  height: 1px;
  border-top: 1px solid #ccc;
  width: 100%;
 }
 .v-spacer {
  width: 100%;
  height: 0.3em;
}
.h-spacer {
  width: 0.3em;
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
input[type=text], input[type=password] {
  border: none;
  outline: none;
  border-bottom: 1px solid #a1a1a1; 
  background: transparent;
  font-family: 'Quicksand';
  text-align:center;
  font-weight: bold;

}
@font-face {
 font-family: Quicksand;
 src: url(/fonts/Quicksand/Quicksand-Regular.ttf);
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