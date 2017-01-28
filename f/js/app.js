/* global this, angular, bind */

// =============================================================================
// === СЕРВИС ==================================================================
// =============================================================================

var Service = function($rootScope, $http, $timeout) {
	this.$scope	= $rootScope;
	this.$http	= $http;
	this.$timeout	= $timeout;

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
	
	
	// Параметры объекта
	this.$scope.videoParam = {};


	// Методы
	this.$scope.videoFunc = {};
	
	
	// События
	// ...
	
	
	// Запуск
	this.service.getVideoData().then(function(data) {
		this.$scope.videoParam.data = data;
		
	}.bind(this));

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


// =============================================================================
// === ИНИЦИАЛИЗАЦИЯ ===========================================================
// =============================================================================

angular.module('twistApp', [])
	.factory('Service', [
		'$rootScope', '$http', '$timeout',
		function ($rootScope, $http, $timeout) {
			return new Service($rootScope, $http, $timeout);
		}
	])
	.controller('VideoCtrl', ['$scope', '$element', 'Service', '$timeout', VideoCtrl])
	.controller('VideoItemCtrl', ['$scope', '$element', 'Service', '$timeout', VideoItemCtrl])
;
