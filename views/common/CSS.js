var main = ({theme, accordian}) => { 
 return `
 <style>
 html {
}

 body {
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

var MetroPanelStart = (id, title, icon) => {
  return `
  <div 
   id='${id}' 
   class="mx-auto rounded"
   data-role="panel"
   data-title-caption="${title}"
   data-cls-title="text-bold bg-lightGray fg-black"
   data-title-icon="<span class='${icon}'></span>"
   data-collapsible="true"
   data-draggable="false">  
  `;
}

var MetroPanelEnd = () => {
  return `</div>`;
}

// <li data-icon="<span class='mif-folder fg-green'>" data-caption="Documents"></li>
// <li data-icon="<span class='mif-folder-download fg-blue'>" data-caption="Downloads"></li>
var listPanel = (id, title, icon) => {
  return `
  ${MetroPanelStart(id, title,icon)}
  <div class="">
  <table id="${id}-table" class="table text-left striped table-border mt-4"
  data-role="table" data-static-view="true"
  data-cls-table-top="row flex-nowrap"
  data-cls-search="cell-md-8"
  data-cls-rows-count="cell-md-4"
  data-source="data/table.json"  
  data-rows="5"
  data-rows-steps="5, 10"
  data-show-activity="false">
<thead>
</thead>
<tbody>
</tbody>
</table>
  </div>
  ${MetroPanelEnd()}
  `;
}

module.exports = { main, profile, ll, spacer, nbsp, MetroPanelStart, MetroPanelEnd, listPanel};