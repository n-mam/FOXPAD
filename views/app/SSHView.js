var css = require('../common/CSS');
var input = require('../common/Input');
var fsbrowser = require('../common/FSBrowser');

function  render(id)
{
  return `
    <div id=${id} class='flex' style='display:none'>
    SSH
    </div>
  `;
}

module.exports = { render }