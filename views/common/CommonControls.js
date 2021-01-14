function renderListView(items, id, handler, icon) 
{
  let h = ``;

  for (let i = 0; i < items.length; i++)
  {
    h += `<li id="${id + '-li-' + items[i].id}" 
            data-icon="<span class='${icon} fg-black'>" 
            data-caption="<span class='caption'>${items[i].sid}</span>"
          </li>`
  }

  return `
   <ul id="${id}"
       class="p-3"
       data-role="listview"
       data-on-node-click=${handler}>
     ${h}
   </ul>`;
}

function renderSelect(options, id, title, icon)
{
  let h = ``;

  for (let i = 0; i < options.length; i++)
  {
    h += `<option value="${options[i].id}" data-template="<span class='${icon} icon'></span> $1">${options[i].sid}</option>`
  }

  return `
  <select id="${id}" data-prepend="${title}" data-role="select">
    ${h}
  </select>`;
}

function renderTH(columnNames)
{
  let h = ``;
  
  for (let i = 0; i < columnNames.length; i++)
  {
    h += `<th>${columnNames[i]}</th>`;
  }
 
  return h;
}

function renderTD(rows, keys)
{
  let h = ``;

  for (let i = 0; i < rows.length; i++)
  {
    h += `<tr>`

    for (let j = 0; j < keys.length; j++)
    {
      let content = rows[i][keys[j]].toString();

      if (content.indexOf(" ") === -1 && content.length > 10)
      {
        style = `style="white-space: nowrap;overflow:hidden;text-overflow:ellipsis;width: 100px;"`;
        h += `<td><div ${style}>${content}</div></td>`;
      }
      else
      {
        h += `<td>${content}</td>`;
      }
    }

    h += `</tr>`
  }

  return h;
}

function renderTableView(id, rows, columnNames, handler, nrows)
{
  return `
   <div class="grid">
    <div class="row">
    <div class="table-component w-100">
     <table
       id=${id + '-table'}
       class="table row-hover text-left striped table-border"
       data-rows="${'' + nrows}"
       data-check="true"
       data-rows-steps="${'' + nrows}, ${'' + (nrows*2)}"
       data-static-view="true"
       data-show-activity="false"
       data-cls-search="cell-md-8"
       data-cls-rows-count="cell-md-4" 
       data-cls-table-top="row flex-nowrap"
       data-on-check-click="${'On' + handler + 'TableNodeClick()'}"
       data-pagination-wrapper=".${id}-my-pagination-wrapper">

       <thead>
        <tr>
         ${renderTH(columnNames)}
        </tr>
       </thead>
       <tbody>
         ${renderTD(rows, columnNames)}
       </tbody>
     </table>
    </div>
    </div>
    <div class="row">
       <style> .pagination {margin:0em} </style>
       <div class="w-50 ${id}-my-pagination-wrapper">
       </div>
       <div class="w-50 d-flex flex-align-center flex-justify-end">
        <button class="tool-button" onclick="${'On' + handler + 'AddClick()'}"><span class="mif-plus"></span></button>
        <button class="tool-button" onclick="${'On' + handler + 'DeleteClick()'}"><span class="mif-bin"></span></button>
        <button class="tool-button" onclick="${'On' + handler + 'EditConfigClick()'}"><span class="mif-pencil"></span></button>
       </div>    
    </div>
   </div>`;
}

module.exports = { renderListView, renderSelect, renderTableView }