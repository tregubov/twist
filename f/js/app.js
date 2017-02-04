/* global this, angular, bind */

// =============================================================================
// === СЕРВИС ==================================================================
// =============================================================================

var Service = function($rootScope, $http, $timeout) {
	this.$scope		= $rootScope;
	this.$http		= $http;
	this.$timeout	= $timeout;
	
	this.setIsModalOpen = function(mode) {
		this.$scope.isModalOpen = mode;
	}.bind(this);

};


Service.prototype.getVideoData = function() {
	return this.$http({
		method: 'GET',
		url: 'data/video-list.json'
	}).then(function(response) {
		return response.data;
	}, function() {});

};


// =============================================================================
// === КОНТРОЛЛЕР ==============================================================
// =============================================================================

var VideoCtrl = function($scope, $element, service, $timeout) {
	this.$scope		= $scope;
	this.$element	= $element;
	this.service	= service;
	this.$timeout	= $timeout;
	this.body		= document.getElementsByTagName('body')[0];
	
	
	// Параметры объекта
	this.$scope.videoParam = {
		data: {
			items: []
		},
		allowPrev: false,
		allowNext: false,
		expand: {},
		expandKey: null,
		expandOpen: false
	};


	// Методы
	this.$scope.videoFunc = {
		setExpandData:		this.setExpandData.bind(this),
		closeExpandData:	this.closeExpandData.bind(this),
		goPrev:				this.goPrev.bind(this),
		goNext:				this.goNext.bind(this),
		getVideoSrc:		this.getVideoSrc.bind(this)
	};
	
	
	// События
	this.body.addEventListener('keyup', this.keyEvent.bind(this));
	
	
	// Запуск
	this.service.getVideoData().then(function(data) {
		this.$scope.videoParam.data = data;
		
	}.bind(this));

};


VideoCtrl.prototype.setExpandData = function(key) {
	var p = this.$scope.videoParam;
	
	if(p.data.items[key]) {
		p.expand		= p.data.items[key];
		p.expandKey		= key;
		p.expandOpen	= true;
		
		this.service.setIsModalOpen(true);
		
		p.allowPrev = (key > 0);
		p.allowNext = (key < p.data.items.length-1);
		
	}
	
};


VideoCtrl.prototype.closeExpandData = function() {
	var p = this.$scope.videoParam;
	
	p.expandOpen = false;
	this.service.setIsModalOpen(false);
	this.$scope.$digest();
	
};


VideoCtrl.prototype.goPrev = function() {
	var p = this.$scope.videoParam;
	
	if(p.allowPrev) {
		this.setExpandData(p.expandKey-1);
	}
	
};


VideoCtrl.prototype.goNext = function() {
	var p = this.$scope.videoParam;
	
	if(p.allowNext) {
		this.setExpandData(p.expandKey+1);
	}
};


VideoCtrl.prototype.getVideoSrc = function() {
	return 'https://www.youtube.com/embed/' + this.$scope.videoParam.expand.youtube_code;
	
};


VideoCtrl.prototype.keyEvent = function(evt) {
	if(evt.keyCode === 27) {
		this.$scope.videoFunc.closeExpandData();
	}
	
};


var VideoItemCtrl = function($scope, $element, service, $timeout) {
	this.$scope		= $scope;
	this.$element	= $element;
	this.service	= service;
	this.$timeout	= $timeout;
	
	
	// Параметры объекта
	this.$scope.videoItemParam = {
		play: false,
		videoElement: this.$element[0].querySelector('video')
	};


	// Методы
	this.$scope.videoItemFunc = {
		playVideo: this.playVideo.bind(this),
		stopVideo: this.stopVideo.bind(this)
	};

};


VideoItemCtrl.prototype.playVideo = function() {
	this.$scope.videoItemParam.play = true;
	
	this.$scope.videoItemParam.videoElement.currentTime = 0;
	this.$scope.videoItemParam.videoElement.play();

};


VideoItemCtrl.prototype.stopVideo = function() {
	this.$scope.videoItemParam.play = false;
	
	this.$scope.videoItemParam.videoElement.pause();
	this.$scope.videoItemParam.videoElement.currentTime = 0;

};


var PageMainCtrl = function($scope, $element, service, $timeout) {
	this.$scope		= $scope;
	this.$element	= $element;
	this.service	= service;
	this.$timeout	= $timeout;
	
	
	// Параметры объекта
	this.$scope.pageMainParam = {
		isSecondScreen: false
	};
	
	
	// Методы
	this.$scope.pageMainFunc = {
		
	};
	
	
	// События
	document.addEventListener('mousewheel', this.onMouseWheel.bind(this), false );

};


PageMainCtrl.prototype.onMouseWheel = function(evt) {
	var p = this.$scope.pageMainParam;
	
	// Первый экран и скролл больше 40px
	if(p.isSecondScreen === false && evt.deltaY > 40) {
		p.isSecondScreen = true;
		this.$scope.$digest();
	}
	
	
	// Второй экран и скролл больше 40px
	if(p.isSecondScreen === true && evt.deltaY < -40) {
		p.isSecondScreen = false;
		this.$scope.$digest();
	}
	
};


// =============================================================================
// === ИНИЦИАЛИЗАЦИЯ ===========================================================
// =============================================================================

angular.module('twistApp', [])
	.config(function($sceDelegateProvider) {
		$sceDelegateProvider.resourceUrlWhitelist([
			'self', 'https://www.youtube.com/**'
		]);
	})
	.factory('Service', [
		'$rootScope', '$http', '$timeout',
		function ($rootScope, $http, $timeout) {
			return new Service($rootScope, $http, $timeout);
		}
	])
	.controller('PageMainCtrl',		['$scope', '$element', 'Service', '$timeout', PageMainCtrl])
	.controller('VideoCtrl',		['$scope', '$element', 'Service', '$timeout', VideoCtrl])
	.controller('VideoItemCtrl',	['$scope', '$element', 'Service', '$timeout', VideoItemCtrl])
;
