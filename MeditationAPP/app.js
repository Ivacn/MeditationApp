const song = document.querySelector(".song");
const play = document.querySelector(".play");
const replay = document.querySelector(".replay");
const outline = document.querySelector(".moving-outline circle");
const video = document.querySelector(".vid-container video");

//Sesler için olan kısım
const sounds = document.querySelectorAll(".sound-picker button");
//Zaman oynatıcı için olan kısım
const timeDisplay = document.querySelector(".time-display");
const outlineLength = outline.getTotalLength();
//Süre için olan kısım
const timeSelect = document.querySelectorAll(".time-select button");
let fakeDuration = 600;

outline.style.strokeDashoffset = outlineLength;  /* sürenin akışının anlaşılması için düzenlenen alan */
outline.style.strokeDasharray = outlineLength;
timeDisplay.textContent = `${Math.floor(fakeDuration / 60)}:${Math.floor(
  fakeDuration % 60  /* zamanı düzenleme */
)}`;

sounds.forEach(sound => {
  sound.addEventListener("click", function() {
    song.src = this.getAttribute("data-sound");
    video.src = this.getAttribute("data-video");
    checkPlaying(song);
  });
});

play.addEventListener("click", function() {  /* kullanıcı seçim yaptığında otomatik olarak yürütülecek olan seslerin düzenlenmesi */
  checkPlaying(song);
});

replay.addEventListener("click", function() {
    restartSong(song);
    
  });


const restartSong = song =>{  /* zaman seçiminde şarkının oynama düzeninin ayarlanması */
    let currentTime = song.currentTime;
    song.currentTime = 0;
    console.log("ciao")

}

timeSelect.forEach(option => {
  option.addEventListener("click", function() {
    fakeDuration = this.getAttribute("data-time");
    timeDisplay.textContent = `${Math.floor(fakeDuration / 60)}:${Math.floor(
      fakeDuration % 60
    )}`;
  });
});

const checkPlaying = song => {  /* seçilen seslerin duraklatılabilmesi için olan kısım */
  if (song.paused) {
    song.play();
    video.play();
    play.src = "./svg/pause.svg";
  } else {
    song.pause();
    video.pause();
    play.src = "./svg/play.svg";
  }
};

song.ontimeupdate = function() {
  let currentTime = song.currentTime;
  let elapsed = fakeDuration - currentTime;
  let seconds = Math.floor(elapsed % 60);
  let minutes = Math.floor(elapsed / 60);
  timeDisplay.textContent = `${minutes}:${seconds}`;
  let progress = outlineLength - (currentTime / fakeDuration) * outlineLength;
  outline.style.strokeDashoffset = progress;

  if (currentTime >= fakeDuration) {  /* video durdurulduğunda*/
    song.pause();
    song.currentTime = 0;
    play.src = "./svg/play.svg";
    video.pause();
  }
};



  window.addEventListener("DOMContentLoaded", function(event) {
	  
	  	var user=getuserFromSession();
		if(user)
		{
			AddActivity(user.UserID,1);
			console.log(user.UserName);
			document.getElementById('lblUserNameSurname').innerHTML ='Welcome '+user.UserNameSurname.trim();
		}else{
			document.getElementById('lblUserNameSurname').innerHTML='Welcome';
		}
  });
  //farkli js dosyalara bakiyruz
window.addEventListener("beforeunload", function (e) {
  var userActivity=getuserActivityFromSession();
  if(JSON.stringify(userActivity)!='{}')
  {
		console.log(userActivity.ActivityId);
		UpdateActivity(userActivity.ActivityId);
  }                      
});
  
  function LogOut()
{
	//  sessionStorage'dan activtyid al ve çıkış için yönlendirme öncesinde activty update yap(çıkış tarihi güncelle) ve sessionStorage'ı boşalt 
   // ve sayfayı login sayfasına yönlendir.	
	var userActivity=getuserActivityFromSession();
		UpdateActivity(userActivity.ActivityId);
		sessionStorage.removeItem('user');
	    sessionStorage.removeItem('userActivity');
		document.location.href = "login.html";
}
  
function  AddActivity(userId,activityType)
{
	const dataToSend = JSON.stringify({  "userId": userId,  "activityType": activityType});

fetch('http://localhost/MeditationApp/User/Activity/Add', {
    method: 'POST',
    headers: { 	'Content-Type': 'application/json'},
    body: dataToSend
})
    .then(resp => {
		     console.log(resp.json);
           return resp.json();
    })
    .then(dataJson => {
       // alert("Kullanıcı Giriş aktivitesi eklendi.
		saveSession("userActivity", dataJson.Data.Result);
    })
    .catch(err => {
        alert("Error!")
    })
}


function UpdateActivity(activityId)
{
	const dataToSend = JSON.stringify({"ActivityId": activityId});
var url='http://localhost/MeditationApp/User/Activity/Update?ActivityId='+activityId;
fetch(url, {
    method: 'POST',
    headers: { 	'Content-Type': 'application/json'}
})
    .then(resp => {
		     console.log(resp.json);
           return resp.json();
    })
    .then(dataJson => {
       // alert("Kullanıcı Giriş Aktivitesi güncellendi!")
		saveSession("userActivity", dataJson.Data.Result);
    })
    .catch((error) => {
  console.log(error)
})
}


function getuserFromSession() {
  var user = {};
  if (typeof sessionStorage.user !== "undefined") {
    user = JSON.parse(sessionStorage.user);
  }
  return user;
}

function getuserActivityFromSession() {
  var userActivity = {};
  if (typeof sessionStorage.userActivity !== "undefined") {
    userActivity = JSON.parse(sessionStorage.userActivity);
  }
  return userActivity;
}


function saveSession(objKey,obj) {
  sessionStorage.setItem(objKey, JSON.stringify(obj));
  return true;
}
