ready = function() {
	var previewList = document.querySelectorAll('.video-feed__item');
	
	for(i=0; i<previewList.length; i++) {
		var elm = previewList[i];
		
		elm.addEventListener('mouseenter', function(evt) {
			var video = evt.target.querySelector('video');
			
			if(video) {
				video.currentTime = 0;
				video.play();
			}
		});
		
		elm.addEventListener('mouseleave', function(evt) {
			var video = evt.target.querySelector('video');
			
			if(video) {
				video.pause();
				video.currentTime = 0;
				
				setTimeout(function() {
					video.load();
				}, 100);
			}
		});
		
	}
};

document.addEventListener("DOMContentLoaded", ready);
