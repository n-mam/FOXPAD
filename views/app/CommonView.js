var u = require('../../lib/util');
var css = require('../common/CSS');
var input = require('../common/Input');

var script = (label, {name, pk, fk, fk1, fk2, c1, c2, c3, c4, c5}) => 
{
  return `
   <script>
     function onSubmit()
     {
       let row = {};
       /** for updates undefined vlues would be removed by the eventual json.stringify */
       ${u.isDefined(pk.value) ? `row['${pk.name}']='${pk.value}'` : ``} //update
       ${u.isDefined(fk) ? `row['${fk.name}']='${fk.value}'` : ``}
       ${u.isDefined(fk1) ? `row['${fk1.name}']='${fk1.value}'` : ``}
       ${u.isDefined(fk2) ? `row['${fk2.name}']='${fk2.value}'` : ``}       
       ${u.isDefined(c1) ? `row['${c1.name}']=${c1.name}Value` : ``}
       ${u.isDefined(c2) ? `row['${c2.name}']=${c2.name}Value` : ``}
       ${u.isDefined(c3) ? `row['${c3.name}']=${c3.name}Value` : ``}
       ${u.isDefined(c4) ? `row['${c4.name}']=${c4.name}Value` : ``}
       ${u.isDefined(c5) ? `row['${c5.name}']=${c5.name}Value` : ``}       

       /** for create : check if any element is null or undefined */
       ${!u.isDefined(pk.value) ?
        `let valid = true;
         let missing = [];
 
         Object.keys(row).forEach(
          function(key, index) {
            if (!isDefined(row[key]))
            {
              valid = false;
              missing.push(key);
            }
         });
 
         if (!valid)
         {
           show_message('Please provide a value for : ' + missing);
           return;
         }` : ``
        }


       _crud(
         {
           action: ${u.isDefined(pk.value) ? `'UPDATE'` : `'CREATE'` }, 
           table: '${name}', 
           rows: [row]
         },
         true);
     }
   </script>`;  
}

var AddNewTarget = ({name, pk, fk, fk1, fk2, c1, c2, c3, c4, c5}, id, visible) =>
{
  let bEdit = u.isDefined(pk.value);

  return `
   <div ${u.isDefined(id) ? `id=${id}` : ``} class='flex column' style='display:${(u.isDefined(visible) && visible) ? 'block': 'none'}'>
     <b>${bEdit ? `` : `New`} ${name}</b>
     ${css.spacer(4)}
     ${u.isDefined(c1) ? c1.render(c1.name) + css.spacer(2) : ''}
     ${u.isDefined(c2) ? c2.render(c2.name) + css.spacer(2) : ''}
     ${u.isDefined(c3) ? c3.render(c3.name) + css.spacer(2) : ''}
     ${u.isDefined(c4) ? c4.render(c4.name) + css.spacer(2) : ''}
     ${u.isDefined(c5) ? c5.render(c5.name) + css.spacer(2) : ''}     
     ${script('Name', {name, pk, fk, fk1, fk2, c1, c2, c3, c4, c5})}
     ${css.spacer(3)}
     <div class='flex row'>
       ${input.Button(bEdit ? `SAVE` : 'ADD', 'onSubmit()')}
       ${css.spacer(2, 'h-spacer')}
       ${input.Button(`CANCEL`, `window.location=document.referrer;`)}
     </div>
   </div>
  `;

}

module.exports = { AddNewTarget }