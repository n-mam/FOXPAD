
function GetNextlabelGallery()
{
  let id = 0;
  let table = $('#id-face-gallery-table').data('table');
  let subjects = table.getItems();

  for (let i = 0; i < subjects.length; i++)
  {
    if (subjects[i][0] > id)
    {
      id = subjects[i][0];
    }
  }

  return (id + 1);
}

function OnGalleryDeleteClick()
{
  let table = $('#id-face-gallery-table').data('table');
  let items = table.getSelectedItems();

  if (!items.length) 
  {
    show_message("Please select a subject to delete");
    return;
  }

  let id = [];

  for (let i = 0; i < items.length; i++)
  {
    id.push(items[i][0]);
  }

  _crud(
    {
      action: 'DELETE',
      table: 'FaceGallery',
      where: 'id IN (' + id.toString() + ')',
      rows: [{x: 'y'}]
    },
    false,
    (res, e) => {
      if (!e)
      {
        items.forEach(element => {
          table.deleteItem(0, element[0]);
        });
        table.draw();
      }
    });
}

function OnGallerySaveButton(id)
{
  let name = document.getElementById('new-sub-name').value;
  let tags = document.getElementById('new-sub-tags').value;
  let files = document.getElementById('new-sub-image').files;

  let images = '';
  let newid = GetNextlabelGallery();

  for (let i = 0; i < files.length; i++)
  {
    images += newid.toString() + '_' + name + i.toString() + '.png' + ', ';
  }

  images = images.trim();
  images = images.substring(0, images.length - 1);

  let subject = {
    name: name,
    images: images,
    tags: tags,
    uid: uid.toString()
  }

  _crud(
   {
     action: isDefined(id) ? 'UPDATE': 'CREATE',
     table: 'FaceGallery',
     rows: [subject]
   });
}

function OnGalleryFileSelect(files, element) 
{
  let name = $('#new-sub-name').val();

  if (!name.length) {
    show_message("Please enter the subject name first");
    return;
  }

  let newid = GetNextlabelGallery();

  for (let i = 0; i < files.length; i++)
  {
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
  
    let url = '/upload?folder=' + '/www/image' + '&file=' + newid.toString() + '_' + name + i.toString() + '.png'; /* 0_obama3.png files[i].name*/
  
    _xhr.bind(o)(url, 'POST', files[i], (res) => {
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
}

function OnGalleryEditConfigClick()
{
  var table = $('#id-face-gallery-table').data('table');
  let items = table.getSelectedItems();

  if (!items.length) {
    show_message("Please select a gallery item to edit");
    return;
  }

  if (items.length > 1) {
    show_message("Please select a single gallery item to edit");
    return;
  }

}

function OnGalleryAddClick()
{
  Metro.dialog.create({
    title: "New Subject",
    content: AddNewGallerySubjectView(),
    closeButton: true,
    actions: [
        {
          caption: "SAVE",
          cls: "js-dialog-close",
          onclick: function(){
            OnGallerySaveButton();
          }
        },
        {
          caption: "CANCEL",
          cls: "js-dialog-close",
          onclick: function(){
              
          }
        }
    ]
  });
}

function AddNewGallerySubjectView() {
  return `
    <div class="row">
       <div class="cell-12"><input id="new-sub-name" type="text" data-role="input" data-prepend="Name"></div>
    </div>
    <div class="row">
       <div class="cell-12"><input id="new-sub-image" type="file" data-on-select="OnGalleryFileSelect" multiple="multiple" data-role="file" data-prepend="Image" data-button-title="<span class='mif-upload'></span>"></div>
    </div>
    <div class="row">
       <div class="cell-12"><input id="new-sub-tags" type="text" data-role="taginput" data-max-tags="5" data-random-color="true"></div>
    </div>
  `;
}

function InitGalleryTable()
{
  $("#id-face-gallery-table").table();

  $("#id-face-gallery-table").on("click", "td:not(.check-cell)", function() {
    let e = $(this);
    while (!e.hasClass("check-cell")) {
      e = e.prev();
    }
    OnSubjectSelect(e.next().text());
  });
}

windowOnLoadCbk.push(InitGalleryTable);