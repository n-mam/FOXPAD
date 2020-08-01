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
   let linkedViewCenter = null;
   let linkedViewRight = null;

   function onFrameOpen(frame)
   {
     if (linkedViewCenter)
     {
      linkedViewCenter.style.display = 'none';
     }
     if (linkedViewRight)
     {
      linkedViewRight.style.display = 'none';
     }

     linkedViewCenter = document.getElementById(frame.dataset.link + '-center');
     linkedViewRight = document.getElementById(frame.dataset.link + '-right');

     if (linkedViewCenter) linkedViewCenter.style.display = 'flex';
     if (linkedViewRight) linkedViewRight.style.display = 'flex';     
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
  <div class="cell">
    <div data-role="accordion"
         data-one-frame="true"
         data-show-active="true"
         data-on-frame-open="onFrameOpen(arguments[0])"
         data-on-frame-close="onFrameClose(arguments[0])"    
         data-active-heading-class="bg-cyan fg-white"
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

  html += `</div></div>`;

  return `
    ${style()}
    ${html}
    ${script()}
  `;
}

module.exports = { render }