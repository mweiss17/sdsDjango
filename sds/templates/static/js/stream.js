var mAudioPlayer = document.getElementsByTagName("audio")[0];
var firstClick = true;
this.loadMix = function(){
	try{
		this.mAudioPlayer.play();
		setTimeout("this.mAudioPlayer.pause()", 10)
	}
	catch(err){
		
console.log( err );
	}
	this.mAudioPlayer.pause();
}

this.playMix = function(){
	try{
		this.mAudioPlayer.currentTime = playtime;
		this.mAudioPlayer.play();
		if(firstClick){
			document.getElementById("resync").innerHTML = "If you get out of sync just reload this page";
			firstClick = false;
		}
	}
	catch(err){
		console.log( err );
	}
}

var loadbutton = document.getElementById('load')
var playButton = document.getElementById('play')
var count = 0;
var count2 = 0;
var playtime = {{eta}};
setInterval(showRemaining, 1000);
loadbutton.addEventListener('click',hideshow,false);


function showRemaining() {
	playtime = playtime + 1;
	if(playtime > -300){
		makeLoadButtonVisible();
	}
	if(playtime >= 0){
		makePlayButtonVisible();
		makeLoadButtonInvisible();
	}
	if(playtime >= 0){
	var hours = Math.floor(( playtime/ 3600) % 24);
	var minutes = Math.floor(( playtime / 60) % 60);
	var seconds = Math.floor( playtime % 60);
	document.getElementById("countdown").innerHTML = hours + 'hrs ';
	document.getElementById("countdown").innerHTML += minutes + 'mins ';
	document.getElementById("countdown").innerHTML += seconds + 'secs';
	}
	if(playtime <= 0){
	var days = Math.floor( -playtime / 86400);
	var hours = Math.floor(( -playtime / 3600) % 24);
	var minutes = Math.floor(( -playtime / 60) % 60);
	var seconds = Math.floor( -playtime % 60);
	document.getElementById("countdown").innerHTML = "Broadcast starts in ";
	document.getElementById("countdown").innerHTML += days + 'days ';
	document.getElementById("countdown").innerHTML += hours + 'hrs ';
	document.getElementById("countdown").innerHTML += minutes + 'mins and ';
	document.getElementById("countdown").innerHTML += seconds + 'secs';
	}
}

function makeLoadButtonVisible(){
	if(count == 1){
		return;
	}
	count++;
	document.getElementById('load').style.display = 'block';
}
function makeLoadButtonInvisible(){
	if(count == 2){
		return;
	}
	count++;
	document.getElementById('load').style.display = 'none';
}


function makePlayButtonVisible(){
	if(count2 == 1){
		return;
	}
	count2++;
	document.getElementById('play').style.display = 'block';
}
// hides the load button after you click it (if you reclick the load button, you move the mix forward by 10 millis)
function hideshow() {
    document.getElementById('load').style.display = 'none'; 
}  

