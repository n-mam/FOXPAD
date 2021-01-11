   window.onload = function() {
     for (var i = 0; i < windowOnLoadCbk.length; i++) 
     {
       windowOnLoadCbk[i]();
     }
   };

   var toogleauth = (toshow) => 
   {
     document.getElementById('email').value = '';

     document.getElementById('password').value = '';

     toggleaction(toshow);

     var e = document.getElementById('auth');

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

   var toggleaction = (toshow) =>
   {
     var e = document.getElementById('l-toggle');

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

   var _crud = (data, backTo, cbk) =>
   {
     var j = JSON.stringify(
       {
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

            if(isDefined(backTo))
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

   var ta = (n) => {
     var r = []; 
     for (let i = 0; i < n; i++)
        r[i] = i;
     return r;
   }
   
   var _auth = (api) =>
   {
     var email, password;

     if (api == "LOGIN" || api == "SIGNUP")
     {
       var e = document.getElementById('email');
       var p = document.getElementById('password');
    
       email = e.value.trim();
       password = p.value.trim();

       if (!email.length || !password.length) 
       {
         show_message('Invalid E-MAIL or PASSWORD');   
         return;
       }
     }

     var j = JSON.stringify(
                  {
                    'token' : null,
                    'api' : api,
                    'name' :  email,
                    'email': email,
                    'password' : password
                  });

     _xhr ('/api', 'POST', j, (res) => {
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
     });
   }

   function _xhr(url, method, data, cbk)
   {
     var x = new XMLHttpRequest();

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

  var show_message = (message, top = false, type = "alert") =>
  {
    let opt = {
      showTop: top,
      timeout: 3000
    }
    Metro.toast.create(message, null, null, type, opt);
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

  var isEmpty = (o) =>
  {
    return (Object.keys(o).length === 0 && o.constructor === Object);
  }

  var showKiss = (file, confirm) =>
  {
    let imageLabel = document.getElementById('id-kiss-image');

    imageLabel.innerHTML = file;
    
    let kiss = document.getElementById('id-kiss');

    kiss.style.display = 'block';
  }