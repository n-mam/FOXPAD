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
   let currentView = null;
   function onFrameOpen(frame)
   {
     console.log(frame);
     if (currentView)
     {
       currentView.style.display = 'none';
     }
     currentView = document.getElementById(frame.dataset.link);
     currentView.style.display = 'inline-flex';
   }
   function onFrameClose(frame)
   {
     console.log(frame);
     let view = document.getElementById(frame.dataset.link);
     view.style.display = 'none';     
   }   
  </script>
  `;
}

var render = (title, sections) =>
{
  let html = `${css.spacer(2)}`;

  if (title.length)
  {
    html += `<p><b>${title}</b></p>
             ${css.spacer(2)}`;
  }

  html += `
   <div  data-role="accordion"
    data-one-frame="false"
    data-show-active="true"
    data-on-frame-open="onFrameOpen(arguments[0])"
    data-on-frame-close="onFrameClose(arguments[0])"    
    data-active-heading-class="bg-lightCyan fg-white"
    data-active-content-class="bg-grayBlue fg-white">`;

  sections.forEach(
    element => {
    html += `
    <div class="frame" data-link='${element.link}'>
      <div class="heading"><b>${element.title}</b></div>
      <div class="content">
        <div class="p-2">Cur luba manducare? Pol, a bene ionicis tormento...</div>
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