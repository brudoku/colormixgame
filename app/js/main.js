var ColorMixer = require('./ColorMixer.js');
var cm = new ColorMixer();
var app = angular.module('app', []);
app.controller('mixer', ['$scope', mainCtrl]);
app.directive('setColour', function(){
	return {
        scope: {clr: '='},
        template: '<div class="clr-item">{{clr.name}}</div>',
		link: function(scope, elem, attrs){
			var $elem = angular.element(elem);
			var rgb = toRgbString(JSON.parse(attrs.rgb).rgb)
			$elem.css('background-color', rgb);
		}
    }
});

function mainCtrl($scope){

	$scope.colours = [
		{
			name: 'violet',
			rgb: {r: 148, g: 0, b: 211}
		},
		{
			name: 'indigo',
			rgb: {r: 75, g: 0, b: 130}
		},
		{
			name: 'blue',
			rgb: {r: 0, g: 0, b: 255}
		},
		{
			name: 'green',
			rgb: {r: 0, g: 255, b: 0}
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

	// $scope.selectedColours = cm.getFewRandom($scope.colours, 2);
	// $scope.mix = cm.mixColours($scope.selectedColours);
	// $scope.unselectedColours = cm.getUnusedItems($scope.colours, $scope.selectedColours);
}

function log(args) {
    console.log(args)
}


function toRgbString(rgbObj) {
	return 'rgb(' + rgbObj.r + ',' + rgbObj.g  + ',' +  rgbObj.b + ')'
}
