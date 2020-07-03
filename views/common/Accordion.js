var css = require('../common/CSS');
var u = require('../../lib/util');

var style = () =>
{
  return ``;
}

var script = () =>
{
  return ``;
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
    data-active-heading-class="bg-lightCyan fg-white"
    data-active-content-class="bg-grayBlue fg-white">`;

  sections.forEach(
    element => {
    html += `
    <div class="frame">
      <div class="heading">${element.title}</div>
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