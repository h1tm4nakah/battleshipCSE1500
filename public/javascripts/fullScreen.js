var logo = document.getElementById("logo");

logo.addEventListener("click", func1, false);

function func1(){
	
	if (logo.requestFullscreen) {
    logo.requestFullscreen();
  } else if (logo.mozRequestFullScreen) { /* Firefox */
    logo.mozRequestFullScreen();
  } else if (logo.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    logo.webkitRequestFullscreen();
  } else if (logo.msRequestFullscreen) { /* IE/Edge */
    logo.msRequestFullscreen();
  }
}