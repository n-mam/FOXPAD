var css = require('../common/CSS');
var u = require('../../lib/util');

var style = () =>
{
  return ``;
}

var script = () =>
{
  return `
  <script>
   let linkedView = null;

   function onFrameOpen(frame)
   {
     if (linkedView)
     {
       linkedView.style.display = 'none';
     }

     linkedView = document.getElementById(frame.dataset.link);   
     
     if (linkedView) linkedView.style.display = 'flex';
   }

   function onFrameClose(frame)
   {
     let lv = document.getElementById(frame.dataset.link);
     if (lv) lv.style.display = 'none';
   }   
  </script>
  `;
}

var render = (title, sections) =>
{
  let html = ``;

  if (title.length)
  {
    html += `<p><b>${title}</b></p>
             ${css.spacer(2)}`;
  }

  html += `
   <div class="w-20" data-role="accordion"
    data-one-frame="false"
    data-show-active="true"
    data-on-frame-open="onFrameOpen(arguments[0])"
    data-on-frame-close="onFrameClose(arguments[0])"    
    data-active-heading-class="bg-lightCyan fg-white"
    data-active-content-class="fg-black">`;

  sections.forEach(
    element => {
    html += `
    <div class="frame" data-link='${element.link}'>
      <div class="heading"><b>${element.title}</b></div>
      <div class="content">
          ${element.content}
      </div>
    </div>
    ${css.spacer(1)}`;
  });

  html += `</div>`;

  return `
    ${style()}
    ${html}
    ${script()}
  `;
}

module.exports = { render }