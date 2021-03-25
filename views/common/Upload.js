var u = require('../../lib/util');

var script = (folder, name) =>
{
  return `
   <script>

   var ${name}Value;

   function onFiles(input)
   {
     if (input.files && input.files[0])
     {
       console.log(input.files[0].name + ' ' + input.files[0].size);
       ${name}Value = input.files[0].name;       
       var reader = new FileReader();
       reader.onload = function (e) 
       {
        document.getElementById('file-upload-${name}').src = e.target.result;
       };
       reader.readAsDataURL(input.files[0]);
     }

     let o =
     {
       xhr:
        {
          property: 'upload',
          event: 'progress',
          cbk: (evt) => {
                   console.log('upload progress: ' + (evt.loaded/evt.total*100) + '%');
                }
        }
     }

     let url = '/upload?folder=' + '${folder}' + '&file=' + input.files[0].name;

     _xhr.bind(o)(url, 'POST', input.files[0], (res) => {
        if (res)
        {
          if (res.status == 'OK')
          {
            show_message("upload successful", false, "primary");
          }
          else
          {
           show_message(res.msg);
          }
        }
        else
        {
          show_message('upload' + ' : ' + 'request failed');
        }
     });
   }
 </script>
`;}

var style = () => { return `
 <style>
  .custom-file-upload 
  {
    display: inline-block;
    padding: 6px 12px;
    cursor: pointer;
    color: #545454;
    width: 8.7em;
  }
 </style>
`;}

var render = (folder, name) => 
{ 
  return `
   ${style()}
   ${script(folder, name)}
   <label for="file-upload" class="custom-file-upload">
     <input id="file-upload" type='file' onchange="onFiles(this, '${folder}');" style="height: auto;padding: unset;">
   </label>
  `;
}

module.exports = { render };