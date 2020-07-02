var css = require('./CSS')
var u = require('../../lib/util');

var style = (source) =>
{
  let columns = Object.keys(source).length;

  return `
   <style>
    .lr-${source.name} {
      min-height: 29em;
      max-height: 29em;      
    }
    .lc-${source.name} {
      /** list container */
      width: 100%;
      text-align: center;
      overflow: auto;
      border-bottom-left-radius: 0.3em;
      border-bottom-right-radius: 0.3em;      
      justify-content: flex-start;
      border: 1px solid var(--border-color);
    }
    .le-${source.name} {
      /** list element */
      width: 100%;
      padding-top: 0.6em;
      padding-bottom: 0.6em;
    }
    .le-${source.name}:not(.le-header-${source.name}):hover {
      background-color: #eaeaea !important; 
    }
    .le-header-${source.name} { 
      /** list header */
      height: 1.5em;
      cursor: inherit;
      color: grey;
      background-color: whitesmoke;
      border-top-left-radius: 0.3em;
      border-top-right-radius: 0.3em;
      border-top: 1px solid var(--border-color);
      border-left: 1px solid var(--border-color);
      border-right: 1px solid var(--border-color);
    }
    .lse-${source.name} {
      /* line sub-element */
      width: ${80/(columns - 1)}%;
      display: inline-block;
    }
    .lse-check {
      width: 10%;
    }

  </style>`;
}

var render = (results, source, title, q) =>
{
  let html = ``;

  if (!u.isDefined(results))
  {
    return `Error: ListRow, results not defined`;
  }

  if(!u.isDefined(title))
  {
    title = source.name + ' List';
  }

  html += `<p style='color:blue'><b>${title}</b></p>`;
  html += css.spacer(3);
  html += style(source);

  html += `<div class='le-${source.name} le-header-${source.name} flex row'>\n` +
            `<div class='lse-${source.name} lse-check'></div>` +
            `<div class='lse-${source.name}'><b>Name</b></div>` +
            `${u.isDefined(source.pk) ? `<div class='lse-${source.name} lse-wide'>$<b>{source.pk}</b></div>`: ''}` +
            `${u.isDefined(source.fk) ? `<div class='lse-${source.name}'><b>${source.fk}</b></div>`: ''}` +
            `${u.isDefined(source.fk1) ? `<div class='lse-${source.name}'><b>${source.fk1}</b></div>`: ''}` +
            `${u.isDefined(source.fk2) ? `<div class='lse-${source.name}'><b>${source.fk2}</b></div>`: ''}` +
          `</div>\n`;

  html += `<div class='lc-${source.name} hide-scroll'>\n`;

    for (let i = 0; i < results.length; i++)
    {
      queryParams = ``;
  
      if (u.isDefined(q))
      {
        queryParams += q;
      }
  
      if (u.isDefined(source.pk))
      {
        queryParams += `&${source.pk}=${results[i][source.pk]}`;
      }
  
      if (u.isDefined(source.fk))
      {
        queryParams += `&${source.fk}=${results[i][source.fk]}`;
      }
  
      if (u.isDefined(source.fk1))
      {
        queryParams += `&${source.fk1}=${results[i][source.fk1]}`;
      }
  
      if (u.isDefined(source.fk2))
      {
        queryParams += `&${source.fk2}=${results[i][source.fk2]}`;
      }
  
      html += `\n<div class='le-${source.name} flex row' onclick="${`window.location='/${source.name}/show?${queryParams}';`}">` +
                 `<div class='lse-${source.name} lse-check'></div>` +
                 `\n<div class='lse-${source.name}'>` + results[i].name + `</div>` +
                 (u.isDefined(source.pk) ? (`\n<div class='lse-${source.name}'>` + results[i][`${source.pk}`] + `</div>`) : ``) +
                 (u.isDefined(source.fk) ? (`\n<div class='lse-${source.name}'>` + results[i][`${source.fk}`] + `</div>`) : ``) +
                 (u.isDefined(source.fk1) ? (`\n<div class='lse-${source.name}'>` + results[i][`${source.fk1}`]  + `</div>`) : ``) +
                 (u.isDefined(source.fk2) ? (`\n<div class='lse-${source.name}'>` + results[i][`${source.fk2}`] + `</div>`) : ``) +
              `\n</div>\n\n`;
    }

  html += `\n</div>\n`;

  return html;
}

module.exports = { render, style }