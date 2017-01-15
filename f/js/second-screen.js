var setSecondScreen = function(type) {
	var elementSecondScreen = document.getElementsByClassName('page-main__second-screen');
	
	if(elementSecondScreen && elementSecondScreen[0]) {
		if(type === 'set') {
			elementSecondScreen[0].classList.add('view');
		} else if(type === 'unset') {
			elementSecondScreen[0].classList.remove('view');
		}
	}
	
	return false;
	
};
