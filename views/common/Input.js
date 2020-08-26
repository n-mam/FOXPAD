var css = require('../common/CSS');
var u = require('../../lib/util');

var style_progress = (value, max) =>
{
  return `
  <style>
   .Progress {
     width: 88%;
     background-color: #e1e1e1;
     justify-content: flex-start;
     border-radius:0.15em;
   }
   .PBar {
     width: ${value}%;
     height: 0.7em;
     border-radius:0.15em;
     justify-content:flex-start;
     background-color: #22a3e1;
   }
  </style>
  `;
}

var style_select = () =>
{
  return `
    <style>

    </style>
  `;
}

var Select = (value, label, choices, name) =>
{
  let list = ``;

  if (u.isDefined(choices) && choices.length)
  {
    choices.forEach(e => {
      list += `<option value='${e.display}' myvalue=${e.value} ${(u.isDefined(value) && (e.value === value)) ? `selected` : ``}>${e.display}</option>`;
    });
  }

  return `
    ${style_select()}
    <script>
      var ${name}Value;
      function onSelectionChanged${name}(s)
      {
        ${name}Value = s.options[s.selectedIndex].attributes.myvalue.textContent;
      }
    </script>
    <div class='flex column'>
     <select onChange="onSelectionChanged${name}(this);">
       ${list}
     </select>
     ${(u.isDefined(label) && label.length) ? `<p style='margin:0.5em;'>${label}</p>` : ``}
    </div>`;
}

var Text = (value, label, name) =>
{
  return `
    <script>
     var ${name}Value;
     function onTextChanged${name}(c) 
     {
       ${name}Value = c.value;
     }
    </script>  
    <div class='flex'>
      <input id='${'input-' + name}' type='text' onchange="onTextChanged${name}(this)"  ${u.isDefined(value) ? `value="${value}"` : ''} placeholder='${label}' style='text-align:center;' autocomplete="off">
    </div>
  `;
}

var Color= (value, label, name) => 
{
  return `
    <script>
     var ${name}Value;
     function onColorChanged${name}(c) 
     {
       ${name}Value = c.value;
     }
    </script>
    <input type="color" onchange="onColorChanged${name}(this)" name="color" value="${u.isDefined(value) ? value : '#3effeb'}">
    ${css.spacer(1)}
    <p>${label}</p>`;
}

var Image = (source, text, id, w, h) =>
{
  return `
    <img ${u.isDefined(id) ? 'id='+id : ``} src="${source}" alt="${text.replace(/ /g,'')}" style="width:${u.isDefined(w) ? w : 100}%;height:${u.isDefined(h) ? h : 100}%">
    ${css.spacer(1)}
    <p>${text}</p>`;
}

var Button = (label, action) =>
{
  return `
    <div class='flex'>
      <div class='flex button action' onclick="${action}" style='min-width:4em;'>
        <p>${label}</p>
      </div>
    </div>`;
}

var Check = (label, checked, cbkOnChange, idNew, isExisting ) =>
{
  return `
    <div style='text-align: left;padding: 0.2em;'>
      <input type="checkbox" name="input-checkbox" \
             onchange="${cbkOnChange}(this, ${idNew}, ${isExisting});" \
             value="${label}" ${checked ? `checked` : ``}>${label}
      <div class='spacer'></div>
    </div>`
}

var Progress = (value) =>
{
  return `<div class='Progress'><div class='PBar'></div></div>`;
}

module.exports = { Select, Color, Text, Image, Button, Check, Progress, style_progress };