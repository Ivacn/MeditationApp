document.querySelector('.img-btn').addEventListener('click', function()
	{
		document.querySelector('.cont').classList.toggle('s-signup')
	}
);

/*Kullanıcı login bilgilerini ilgili servise gönderir. 
Gelen cevaba göre kullanıcı bilgiini sessionStorage ismindeki browser depolama alanına koyar.
butona bastığımız anda bu function çağırılacak ve servise gideceğiz.
*/


function  btnLoginClick()
{
	
	var userName=document.getElementById("username").value;
	var password=document.getElementById("pass").value;
	
	login(userName,password);
}

function login(userName,password){
		 var apiUrl = 'http://localhost/MeditationApp/User/Login?UserName='+userName+'&UserPass='+password;
	 
	 console.log(apiUrl);// consolelog önemli, bir başka yolu'da alert 
	 
    fetch(apiUrl,{method: 'POST'}).then(response => {
      return response.json();
    }).then(data => {
       
	   if(data.Data.Result)
		{
		//alert("Giriş Başarılı. Yönlendiriliyorsunuz!")
		saveSession("user", data.Data.Result);
		document.location.href = "index.html";//Burada farklı bir url'de verilebilir. 
		}else
		alert("Access Failed! \n please check the information and try again!")	
		console.log(data);
    }).catch(err => {
    });
	
}

function saveSession(objKey,obj) {
  sessionStorage.setItem(objKey, JSON.stringify(obj));
  return true;
}

/*function getSession() {
  var obj = {};
  if (typeof sessionStorage.myObj !== "undefined") {
    obj = JSON.parse(sessionStorage.myObj);
  }
  return obj;
}*/


function  CreateUser()
{
	
	var userName=document.getElementById("txtUserName").value;
	var password=document.getElementById("txtPassword").value;
	var NameSurname=document.getElementById("txtNameSurname").value;
	
	const dataToSend = JSON.stringify({
  "userName": userName,
  "userPass": password,
  "userNameSurname": NameSurname
});

fetch('http://localhost/MeditationApp/User/Create', {
    method: 'POST',
    headers: { 	'Content-Type': 'application/json'},
    body: dataToSend
})
    .then(resp => {
		     console.log(resp.json);
           return resp.json();
    })
    .then(dataJson => {
		
       if(dataJson.Data.StatusCode!="200")
	   {
		   alert(dataJson.Data.ErrorMessage);
	   }else{
		   alert("User registration successful. Please log in with your user information");
		   login(userName,password);
		   //document.querySelector('.cont').classList.toggle('s-signup');
	   }
    })
    .catch(err => {
        alert("Error!")
    })
}
