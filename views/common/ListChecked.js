var css = require('./CSS');
var u = require('../../lib/util');
var input = require('./Input');

var style = () =>
{
  return `
     <style>
      .list-body {
        display: inline-block;
        max-height: 10em;
        width: 18em;
        overflow: auto;
        border: 1px solid var(--border-color);
        padding:0.5em;
      }
     </style>
   `;
}

var script = (source) =>
{
  return `
    <script>

      var state = {};

      function cbkOnChange(e, idNew, idExisting) 
      {
        if (!isDefined(state[e.value]))
        {
          state[e.value] = {original: !e.checked, newId: idNew, existingId: idExisting};
        }

        state[e.value].current = e.checked;        
      }

      function onSave()
      {
        var keys = Object.keys(state);
        var values = Object.values(state);

        for (var i = 0; i < keys.length; i++)
        {
          let o = state[keys[i]].original;
          let c = state[keys[i]].current;

          if (o != c)
          {
            console.log(keys[i] + ' changed from ' + o + ' to ' + c);

            let row = {};

            let action;

            if (c) 
            {
              row['name'] = keys[i];

              ${u.isDefined(source.fk)  ? `row['${source.fk}']=values[i].newId.toString()` : ``};
              ${u.isDefined(source.fk1) ? `row['${source.fk1.name}']='${source.fk1.value}'` : ``};
              ${u.isDefined(source.fk2) ? `row['${source.fk2.name}']='${source.fk2.value}'` : ``};

              action = 'CREATE';
            }
            else
            {
              row['id'] = values[i].existingId.toString();

              action = 'DELETE';
            }

            _crud({action: action, table: '${source.name}', rows: [row]}, true);

          }
        }
      }
    </script>`;
}

var render = (results, existing, source, title, subtitle) =>
{
  let checkedlist = ``;

  for (var i = 0; i < results.length; i ++)
  {
    for (var j = 0; j < existing.length; j++)
    {
      if (existing[j][source.fk] === results[i].id)
      {
        checkedlist += input.Check(results[i].name, true, 'cbkOnChange', results[i].id, existing[j].id);
        break;
      }
    }

    if (j === existing.length)
    {
      checkedlist += input.Check(results[i].name, false, 'cbkOnChange', results[i].id);
    }
  }

  return `
    ${style()}
    <div class='flex column'>
      <p><b>${title}</b></p>
      ${u.isDefined(subtitle) ? `${css.spacer(2)}<p>${subtitle}</p>` : ``}
      ${css.spacer(2)}
      <div class='list-body'>
        ${checkedlist}
      </div>
      ${script(source)} 
      ${css.spacer(3)}
      <div class='flex row'>
        ${input.Button('SAVE', 'onSave()')}
        ${css.spacer(2, 'h-spacer')}
        ${input.Button(`CANCEL`, `window.location=document.referrer;`)}
      </div>        
    </div>
    `;
}

module.exports = { render }