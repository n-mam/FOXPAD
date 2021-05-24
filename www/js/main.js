window.onload = function() {
  for (var i = 0; i < windowOnLoadCbk.length; i++) 
  {
    windowOnLoadCbk[i]();
  }
};

function toogleauth(toshow)
{
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';

  toggleaction(toshow);

  let e = document.getElementById('auth');

  if (e)
  {
    if (e.style.display == 'inline-flex') 
    {
      e.style.display = 'none';
      document.body.removeEventListener("mousedown", onDocumentMouseDown, false);  
    }
    else
    {
      e.style.display = 'inline-flex';
      document.body.addEventListener('mousedown', onDocumentMouseDown, false);      
      document.getElementById("email").focus();        
    }
  }
}

function toggleaction(toshow)
{
  let e = document.getElementById('l-toggle');

  if (typeof toshow == 'undefined')
  {
    e.innerText.includes('SIGNUP') ? toshow = 'SIGNUP' : toshow = 'LOGIN'; 
  }

  if (toshow === 'LOGIN')
  {
    e.innerHTML = 'New user ? <b style="color:blue;border-bottom:solid 1px blue;padding:0.1em;cursor:pointer;" onclick="toggleaction()">SIGNUP</b>';
    document.getElementById('btn-login').style.display = 'inline-flex';
    document.getElementById('btn-signup').style.display = 'none';
  }
  else if (toshow === 'SIGNUP')
  {
    e.innerHTML = 'Already registered ? <b style="color:blue;border-bottom:solid 1px blue;padding:0.1em;cursor:pointer;" onclick="toggleaction()">LOGIN</b>';
    document.getElementById('btn-login').style.display = 'none';
    document.getElementById('btn-signup').style.display = 'inline-flex';
  }
}

function _crud(data, backTo, cbk)
{
  let j = JSON.stringify({
    'token': null,
    'api': 'CRUD',
    'data': data
  });

  _xhr ('/api', 'POST', j, (res) => {
    if (res)
    {
      if (res.status == 'OK') 
      {
        if (isDefined(cbk))
        {
          cbk(res, null);
        }

        if (isDefined(backTo))
        {
          if (backTo === true)
          {
            window.location = document.referrer;
          }
        }
        else
        {
          location.reload(true);
        }
      }
      else
      {
        show_message(res.msg);

        if (isDefined(cbk))
        {
          cbk(null, res.msg);
        }
      }
    }
    else
    {
      if (isDefined(cbk) && isDefined(res))
      {
        cbk(res.msg);
      }
      show_message('CRUD' + ' : ' + 'Request Failed');
    }
  });
}

function _auth(api)
{
  let email, password;

  if (api == "LOGIN" || api == "SIGNUP")
  {
    let e = document.getElementById('email');
    let p = document.getElementById('password');

    email = e.value.trim();
    password = p.value.trim();

    if (!email.length || !password.length) 
    {
      show_message('Invalid E-MAIL or PASSWORD');   
      return;
    }
  }

  let j = JSON.stringify({
    'token' : null,
    'api' : api,
    'name' :  email,
    'email': email,
    'password' : password
  });

  _xhr('/api', 'POST', j,
    (res) => {
      if (res)
      {
        if (res.status == 'OK')
        {
          if (api == "LOGOUT")
          {
            window.location.href = "/";
          }
          else
          {
            location.reload(true);
          }
        }
        else
        {
          show_message(res.msg);
        }
      } 
      else
      {
        show_message(api + ' : ' + 'Request Failed');
      }
    }
  );
}

function _xhr(url, method, data, cbk)
{
  let x = new XMLHttpRequest();

  if (isDefined(this.xhr))
  {
    if (isDefined(this.xhr.property))
    {
      x[this.xhr.property].addEventListener(this.xhr.event, this.xhr.cbk, false);
    }
  }

  x.open(method, url, true);

  x.onreadystatechange = () => {

    if (x.readyState == XMLHttpRequest.DONE) 
    {
      var json = null;

      if (x.status == 200)
      {
        console.log("server: " + x.responseText);

        try
        {
          json = JSON.parse(x.responseText);
        }
        catch (error)
        {
          console.log('json parse error : ' + error.message)
          json = null;
        }
      }
      else
      {
        console.log('status : ' + x.status.toString());
      }

      if (cbk) 
      {
        cbk(json);
      }
    }
  };
  console.log("client: " + data);
  x.send(data);
}

function show_message(message, top = false, type = "alert")
{
  let notify = Metro.notify;
    notify.setup({
      width: 300,
      duration: 500,
      distance: -20
    }
  );

  notify.create(
    message,
    "",
    {
      cls: type
    }
  );

  console.log(message);
}

function onDocumentMouseDown(e)
{
  if ((e.srcElement == document.body) ||
      (e.srcElement == document.getElementById('content')))
  {
    toogleauth();
  }
}

function isEmpty(o)
{
  return (Object.keys(o).length === 0 && o.constructor === Object);
}
