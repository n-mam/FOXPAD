var css = require('../common/CSS');
var u = require('../../lib/util');

var style = (suffix) =>
{
  return `
  <style>
  .accordion${suffix} {
    width: 70%;
    outline: none;
    border: none;       
    color: black;
    padding: 10px;
    transition: 0.3s;
    cursor: pointer;
    text-align: center;       
    font-family:inherit;
    border-radius: 0.3em;
    background-color: white;
    border: 1px solid var(--border-color);
    letter-spacing: 0.1em;
  }
  .accordion${suffix}:hover {
    background-color: #e1e1e1;
    color: black;
  }
  .active${suffix} {
    background-color: var(${suffix.length ? `--accordian-child-color` : `--accordian-color`});
    color: white;
  }
  .accordion${suffix}:after {
    content: '\\002B';
    color: black;
    float: right;
    font-weight: bold;
    margin-left: 5px;
  }
  .active${suffix}:after {
    content: "\\2212";
    color: white;
  }
  .panel${suffix} {
    width: 100%;
    max-height: 0px;
    overflow: hidden;
    background-color: white;    
    transition: max-height 0.2s ease-out;
  }
 </style>
  `;
}

var script = (suffix = '', ae) =>
{
  return `
    <script>
      ${u.getCookie.toString()}
      windowOnLoadCbk.push(
        function() {
          ${u.isDefined(ae) ? 
            `document.getElementById('${ae}').style.display = 'inline-flex';` 
            :
            ``}

          let acc = document.getElementsByClassName('accordion${suffix}');

          for (let i = 0; i < acc.length; i++)
          {
            acc[i].addEventListener(
              "click", 
              function()
              {
                let x = document.getElementsByClassName('accordion${suffix}');
                let i;
    
                for (i = 0; i < acc.length; i++)
                {
                  if (x[i].classList.contains('active${suffix}'))
                  {
                    x[i].classList.toggle('active${suffix}');
    
                    let link = document.getElementById(x[i].dataset.link);
    
                    if (isDefined(link))
                    {
                      link.style.display = 'none';
                    }
    
                    let panel = x[i].nextElementSibling;
    
                    if (panel.innerHTML.trim() != '')
                    {
                      if (panel.style.maxHeight)
                      {
                        panel.style.maxHeight = null;
                      }
                    else
                    {
                      panel.style.maxHeight = panel.scrollHeight + "px";
                    }

                    for (let item of panel.children) 
                    {
                      if (isDefined(item.dataset.link))
                      {
                        link = document.getElementById(item.dataset.link)
                        link.style.display = 'none';
                        for (let i = 0; i < item.classList.length; i++) 
                        {
                          if (item.classList.item(i).includes('active'))
                          {
                            item.classList.toggle(item.classList.item(i));
                          }
                        }
                      }
                    }
                  }
                }//for acc.length
              } //onclick function

              let ac = getCookie(undefined, 'accordion${suffix}');
              let aj = {};

              if (isDefined(ac))
              {
                aj = JSON.parse(ac);
              }

              aj[window.location.pathname] = this.innerText.replace(/\\s/g,'');

              document.cookie = 'accordion${suffix}=' + JSON.stringify(aj) + ';path=/';                 
    
              this.classList.toggle('active${suffix}');
    
              let panel = this.nextElementSibling;
    
              if (panel.innerHTML.trim() != '')
              {
                if (panel.style.maxHeight)
                {
                  panel.style.maxHeight = null;
                }
                else
                {
                  panel.style.maxHeight = panel.scrollHeight + "px";
                }
              }

              var e = document.getElementById(this.dataset.link);
      
              if (e.style.display == 'inline-flex')
              {
                e.style.display = 'none'
              }
              else
              {
                e.style.display = 'inline-flex';
              }
            }
            );
          }//for
          }
        );
    </script>
  `;
}

var render = (title, sections) =>
{
  let {active, suffix} = sections.pop();

  if (!u.isDefined(suffix)) 
  {
    suffix = '';
  }

  if (u.isDefined(active)) 
  {
    let bok = false;
    sections.forEach(element => {
      if (element.title.replace(/\s/g,'') === active)
      {
        bok = true;
      }
    });
    if (!bok && active !== 'none')
    {
      active = sections[0].title.replace(/\s/g,'');
    }
  }
  else
  {
    active = sections[0].title.replace(/\s/g,'');
  }

  let html = ``;

  if (title.length)
  {
    html += `<p><b>${title}</b></p>
             ${css.spacer(2)}`;
  }

  let activeElement = undefined;

  sections.forEach(element => {
    html += `
      <button class='accordion${suffix} ${(active === element.title.replace(/\s/g,'')) ? `active${suffix}` : ``}' data-link='${element.link}'>
        <b>${element.title}</b>
      </button>
      <div class='panel${suffix}' ${(active === element.title.replace(/\s/g,'')) ? 'style="max-height:max-content"' : ''}>
        ${u.isDefined(element.content) ? element.content : ``}
      </div>
      ${css.spacer(1)}`;
    if (active === element.title.replace(/\s/g,''))
    {
      activeElement = element.link;
    }      
  });

  return `
    ${style(suffix)}
    ${html}
    ${script(suffix, activeElement)}
  `;
}

module.exports = { render }