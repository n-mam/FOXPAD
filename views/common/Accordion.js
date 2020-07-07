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
   let currentCenterView = null;
   let currentRightView = null;   
   function onFrameOpen(frame)
   {
     console.log(frame);
     if (currentCenterView)
     {
       currentCenterView.style.display = 'none';
     }
     if (currentRightView)
     {
      currentRightView.style.display = 'none';
     }
     currentCenterView = document.getElementById(frame.dataset.link + '-center');
     currentRightView = document.getElementById(frame.dataset.link + '-right');     
     if (currentCenterView) currentCenterView.style.display = 'flex'; //center is flex
     if (currentRightView) currentRightView.style.display = 'block';  //right is block   
   }
   function onFrameClose(frame)
   {
     console.log(frame);
     let cv = document.getElementById(frame.dataset.link + '-center');
     let rv = document.getElementById(frame.dataset.link + '-right');     
     if (cv) cv.style.display = 'none';
     if (rv) rv.style.display = 'none';     
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
    data-active-content-class="bg-lightGray fg-black">`;

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