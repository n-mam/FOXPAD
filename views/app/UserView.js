var u = require('../../lib/util');
var css = require('../common/CSS');
var input = require('../common/Input');
var listRow = require('../common/ListRow');

function ShowProfile(user)
{
  return `
   <style>
     #me img
     {
       border: 1px solid;
       border-radius: 50%;
     }
  </style>
  <div id='me' class='flex column'>
    <div class='flex'>
      <label>
        <img src='/image/${u.isDefined(user.image) ? user.image : 'profile.png'}' width=72 height=72 alt="avatar"'>
      </label>
    </div>
    ${css.spacer(2)}
    <div class='flex'>
      <p><b>${user.name}</b></p>
    </div>
    ${css.spacer(2)}
    <div class='flex'>
      <p>${user.email}</p>
    </div>
  </div>`;
}

var ShowUserList = (users, source, id) =>
{
  return `<div id='${id}' style='display:none'>` +
          listRow.render(users, source, 'Registered Users') +
          css.spacer(2) + 
          input.Button('ADD', `window.location='/User/add';`) +
          css.spacer(2) +
         `</div>`;
}

module.exports = { ShowProfile, ShowUserList };