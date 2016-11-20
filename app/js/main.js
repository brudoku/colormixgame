'use strict';

var ColorMixer = require('./ColorMixer.js');
var cm = new ColorMixer();
// var _ = require('./lodash.custom.min.js');
var _ = require('lodash');
// var angular = require('angular');
var app = angular.module('app', []);
app.controller('mixer', ['$scope', mainCtrl]);
app.directive('setColour', function(){
	return {
        scope: {clr: '='},
        template: '<div ng-click="test(clr)" class="clr-item">{{clr.name}}</div>',
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
			var rgb = toRgbString(JSON.parse(tAttrs.rgb).rgb);
			$elem.find('div').css('background-color', rgb);
		}
    }
});
app.directive('updateColour', function(){
	return {
		link: function(scope, tElem, tAttrs){
			var $elem = angular.element(tElem);
			scope.$on('update', function(evt, args){
				$elem.css('background-color', args);
			})
		}
    }
});
function mainCtrl($scope){

	$scope.selectedColours = [];
	// $scope.unselectedColours = cm.getUnusedItems($scope.colours, $scope.selectedColours);

	$scope.test = function(clr){
		$scope.addColour(clr);
	}
	var colours = [
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
		}/*,
		{
			name: 'white',
			rgb: {r: 0, g: 0, b: 0}
		}*/
		];

	var coloursObj = _.map(colours, function(elem){
		return cm.getColorObject(elem.rgb);
	});

	$scope.colours = _.zipWith(colours, coloursObj, function(item, value) {
	    return _.defaults({ colorObj: value }, item);
	});
	$scope.addColour = function(clrObj){
		if( _.includes($scope.selectedColours, clrObj) ) return;
		$scope.selectedColours.push(clrObj);
		$scope.unselectedColours = cm.getUnusedItems($scope.colours, $scope.selectedColours);

		//first colour selected, nothing to mix it with!
		if($scope.selectedColours.length == 1){
			$scope.$broadcast("update", clrObj.colorObj.rgbString());
		} else {
			$scope.mixedClr = cm.mixColours($scope.selectedColours);
	        $scope.$broadcast("update", $scope.mixedClr.colorObj.rgbString());
		}


	}
	$scope.mixColours = function(){
		$scope.mixedClr = cm.mixColours($scope.selectedColours);
        $scope.$broadcast("update", $scope.mixedClr.colorObj.rgbString());
		// $scope.selectedColours = cm.getFewRandom($scope.colours, 3);
	}

	function shuffle(o) {
		for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	}

}

function log(args) {
    console.log(args)
}


function toRgbString(rgbObj) {
	return 'rgb(' + rgbObj.r + ',' + rgbObj.g  + ',' +  rgbObj.b + ')'
}
