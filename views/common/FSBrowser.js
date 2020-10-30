var u = require('../../lib/util');

function style()
{
  return `
    <style>
     .fs-browser {
       min-width: 18em;
       max-width: 18em;
       min-height: 29em;
       max-height: 29em;
       border-radius: 0.3em;
       justify-content: flex-start;
       border: 1px solid var(--border-color);
     }
     .fs-content {
       width: 100%;
       overflow:scroll;
       justify-content: flex-start;
     }
     .fs-path {
       width: 100%;
       color: black !important;
       text-overflow: ellipsis;
       height: 1.5em !important;
       font-weight: normal !important;
       background-color: whitesmoke !important;
       border-bottom: 1px solid var(--border-color) !important;
     }
     .fs-file, .fs-folder {
       width: 100%;
       min-height: 2.3em;
       font-weight: bold;
     } 
     .fs-file:hover, .fs-folder:hover {
       cursor: pointer;
       background-color: #eaeaea;
     }
     .fs-file {
      color: black;
     }
     .fs-folder {
       color: blue;
     }
    </style>
  `;
}

function OnListElementClick(id, element)
{
  if (isDefined(element))
  {
    let path = document.getElementById(id + '-fs-path');

    if (element.classList.contains('fs-folder'))
    {
      let listCommand = JSON.parse(document.getElementById(id).dataset.command);

      if (element.textContent.trim() === "..")
      {
        listCommand.Directory = path.value.split( '\\' ).slice( 0, -1 ).join( '\\' );

        if (listCommand.Directory[listCommand.Directory.length - 1] === ':')
        {
          listCommand.Directory += "\\";
        }
      }
      else
      {
        listCommand.Directory = path.value + (path.value[path.value.length -1] != '\\' ? "\\" : "") + element.textContent.trim();
      }

      AgentSend(JSON.stringify(listCommand));      
    }
    else if (element.classList.contains('fs-file'))
    {
      all = document.getElementsByClassName('fs-file');
      for (let i = 0; i < all.length; i++) {
          all[i].style.backgroundColor="inherit";
      }
      element.style.backgroundColor="lightgreen";
      document.getElementById(id).dataset.ImageFile = path.value + "\\" + element.textContent.trim();
    }
  }
}

function OnListResponse(message)
{
  if (message.Response === 'DirectoryList')
  {
    let path = document.getElementById(message.id + '-fs-path');

    let content = document.getElementById(message.id + '-fs-content');

    path.value = message.Directory;

    content.innerHTML = '';

    content.innerHTML += `<div class='flex fs-folder' onclick='OnListElementClick("${message.id}", this)'><b>..</b></div>`;

    message.Files.forEach(element => {
      if (element.Type === 'File')
      {
        content.innerHTML += `
         <div class='flex fs-file' onclick='OnListElementClick("${message.id}", this)'>
          ${element.Name}
         </div>`;
      }
      else if (element.Type === 'Folder')
      {
        content.innerHTML += `
         <div class='flex fs-folder' onclick='OnListElementClick("${message.id}", this)'>
          ${element.Name}
         </div>`;
      }
    });

    return true;
  }
  else
  {
    return false;
  }
}

function render(id, filter)
{
  let listCommand =
  {
    Plugin: 'Common', 
    Action: 'DirectoryList',
    Directory: '',
    id: `${id}`,
    Filter: `${u.isDefined(filter) ? filter : 'All'}`
  };

  html = `
    <div id='${id}' class='flex column fs-browser' data-command='${JSON.stringify(listCommand)}'>
     <input id='${id}-fs-path' class='fs-path fs-folder' type='text' placeholder='DIRECTORY'>
     <div id='${id}-fs-content' class='flex column fs-content hide-scroll'>
       <!--   div class='flex fs-file'>
         file.txt
       </div>
       <div class='flex fs-folder' onclick='OnListtElementClick(this)'>
         FOLDER
       </div  -->
     </div>
    </div>`;

  html += `
    ${style()}
    <script>
      ${OnListElementClick.toString()}
      ${OnListResponse.toString()}
      MessageListeners.push(OnListResponse);
      initActions.push('${JSON.stringify(listCommand)}');
      document.getElementById('${id}-fs-path').addEventListener(
        "keyup",
        function(event) {
          if (event.keyCode === 13) {
            event.preventDefault();
            OnListElementClick('${id}', this);
          }
        });
  </script>`;

  return html;
}

module.exports = { render }