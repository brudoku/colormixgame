var ColorMixer = require('./ColorMixer.js');
var cm = new ColorMixer();
var app = angular.module('app', []);
app.controller('mixer', ['$scope', mainCtrl]);
app.directive('setColour', function(){
	return {
        scope: {clr: '='},
        template: '<div class="clr-item">{{clr.name}}</div>',
        // compile: function(tElem, tAttrs){
        	// log('compile attrs');
   //      	log(tAttrs);
   //      	log('tElem');
   //      	log(tElem);
			// var $elem = angular.element(tElem);
   //      	log('tElem 2');
   //      	log(tElem);
   //      	log('link attrs');
   //      	log(attrs);
        // },
		link: function(scope, tElem, tAttrs){
			var $elem = angular.element(tElem);
			// $elem.addClass('classsss');
			var rgb = toRgbString(JSON.parse(tAttrs.rgb).rgb);
			$elem.find('div').css('background-color', rgb);
		}
    }
});
app.directive('updateColour', function(){
	return {
        scope: {mixedClr: '='},
		link: function(scope, tElem, tAttrs){
			var $elem = angular.element(tElem);
			scope.$on('update', function(evt, args){
				$elem.css('background-color', args);
			})
		}
    }
});
function mainCtrl($scope){
	$scope.test = function(clr){
		console.log('clr: ' + clr.name);
	}
	$scope.colours = [
		{
			name: 'violet',
			rgb: {r: 148, g: 0, b: 211}
			// rgb: {r: 255, g: 0, b: 0}
		},
		{
			name: 'indigo',
			rgb: {r: 75, g: 0, b: 130}
			// rgb: {r: 0, g: 0, b: 255}
		},
		{
			name: 'blue',
			rgb: {r: 0, g: 0, b: 255}
			// rgb: {r: 0, g: 0, b: 0}
		},
		{
			name: 'green',
			rgb: {r: 0, g: 255, b: 0}
			// rgb: {r: 255, g: 255, b: 255}
		},
		{
			name: 'yellow',
			rgb: {r: 255, g: 255, b: 0}
		},
		{
			name: 'orange',
			rgb: {r: 255, g: 127, b: 0}
		},
		{
			name: 'red',
			rgb: {r: 255, g: 0, b: 0}
		}];

	$scope.mixColours = function(){
		$scope.selectedColours = cm.getFewRandom($scope.colours, 5);
		$scope.unselectedColours = cm.getUnusedItems($scope.colours, $scope.selectedColours);
		$scope.mixedClr = cm.mixColours($scope.selectedColours);
		log(toRgbString($scope.mixedClr.rgb));
        $scope.$broadcast("update", toRgbString($scope.mixedClr.rgb));
	}
	// $scope.selectedColours = cm.getFewRandom($scope.colours, 2);
	// $scope.mix = cm.mixColours($scope.selectedColours);
}

function log(args) {
    console.log(args)
}


function toRgbString(rgbObj) {
	return 'rgb(' + rgbObj.r + ',' + rgbObj.g  + ',' +  rgbObj.b + ')'
}
