var css = require('../common/CSS');
var input = require('../common/Input');

function ProcessKISS(ok)
{
  let bDismiss = false;

  let kiss = 
  {
    Plugin: 'Backup',
    Action: 'Kiss',
    ImageFile: '',
    Password: '',
    Cascade: 'AST',
    Iterations: 2000
  };

  if (ok)
  {
    let file = document.getElementById('id-kiss-image').innerHTML;
    let password = document.getElementById('id-kiss-password').value;
    let confirm = document.getElementById('id-kiss-confirm-password').value;
    let iterations = parseInt(document.getElementById('id-kiss-iterations').value);

    if (password.length && confirm.length)
    {
      if (password === confirm)
      {
        kiss['ImageFile'] = file;

        kiss['Password'] = password;

        if (iterations >= 20000)
        {
          kiss['Iterations'] = iterations;

          let cc1 = document.getElementById('id-kiss-cc1');
          let cc2 = document.getElementById('id-kiss-cc2');
          let cc3 = document.getElementById('id-kiss-cc3');

          kiss['Cascade'] = cc1.value[0] + cc2.value[0] + cc3.value[0];

          bDismiss = true;
        }
        else
        {
          show_message("Please enter a PKDF2 iteration count > 20000", true, 'id-kiss-message');
        }
      }
      else
      {
        show_message('Passwords do not match', true, 'id-kiss-message');
      }
    }
    else
    {
      show_message('Please enter the password.', true, 'id-kiss-message')
    }
  }
  else
  {
    show_message('KISS cancelled.', true, 'id-kiss-message');
    bDismiss = true;
  }

  if (bDismiss)
  {
    AgentSend(JSON.stringify(kiss));   

    let e = document.getElementById('id-kiss');

    e.style.display = 'none';
  }
}

function render(id)
{
  return `
    <style>
     #${id} {
       padding: 0.7em;
       border-radius: 0.3em;
       background-color: #f8f9f9;
       border: 1px solid var(--border-color);
       top: 50%;
       left: 50%;
       position: fixed;       
       transform: translate(-50%, -50%);
     }
     #${id} fieldset {
       padding: 1em;
     }
    </style>
    <script>
      ${ProcessKISS.toString()}
    </script>
    <div id='${id}' class='flex column' style='display:none;'>
      ${css.spacer(1)}
      <p><b>Encryption</b></p>
      ${css.spacer(1)}
      <p id=${id}-image style='color:blue;'></p>
      ${css.spacer(1)}      
      <fieldset>
       <legend align='left'><b>Password</b>:</legend>
       <div class='flex column'>
         <input id=${id}-password type='text' Placeholder='Password' style=''/>
         ${css.spacer(1)}
         <input id=${id}-confirm-password type='text' Placeholder='Confirm Password' style=''/>
         ${css.spacer(2)}
       </div>
      </fieldset>
      ${css.spacer(2)}
      <fieldset>
       <legend align='left'><b>Encryption</b>:</legend>
       ${css.spacer(2)}
       <div class='flex row'>
         ${css.nbsp(3)}
         <select id=${id}-cc1>
          <option value='AES' selected>AES</option>
          <option value='Serpent'>Serpent</option>
          <option value='Twofish'>Twofish</option>
         </select>
         ${css.nbsp(3)}
         <select id=${id}-cc2>
          <option value='AES' selected>AES</option>
          <option value='Serpent' selected>Serpent</option>
          <option value='Twofish'>Twofish</option>
         </select>
         ${css.nbsp(3)}
         <select id=${id}-cc3>
          <option value='AES' selected>AES</option>
          <option value='Serpent'>Serpent</option>
          <option value='Twofish' selected>Twofish</option>
         </select>
         ${css.nbsp(3)}
       </div>
       ${css.spacer(2)}
      </fieldset>
      ${css.spacer(2)}      
      <fieldset>
       <legend align='left'><b>Key Derivation</b>:</legend>
       <div class='flex column'>
        <div class='flex row>' style='align-items:flex-end;justify-content:space-between;width:100%;'>
         PKBF2 Iterations: ${css.nbsp(2)}
         <input id=${id}-iterations type='text' style='width:6em;'/>
        </div>
        ${css.spacer(2)}
        <div class='flex row>' style='align-items: flex-end;justify-content:space-between;width:100%;'>
         Hash Algorithm: ${css.nbsp(2)}
         <select style='width:6.5em;'>
          <option value='SHA-512' selected>SHA-512</option>
         </select> 
        </div>
       </div>
       ${css.spacer(2)}
      </fieldset>
      ${css.spacer(2)}
      <div class='flex row'>
       ${input.Button('OK', "ProcessKISS(true)")}
       ${css.nbsp(2)}
       ${input.Button('CANCEL', "ProcessKISS(false)")}       
      </div>
      ${css.spacer(1)}
      <div id=${id}-message class='flex'>
        
      </div>
    </div>
  `;
}

module.exports = { render }