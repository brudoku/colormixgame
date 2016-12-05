'use strict';

var ColorMixer = require('./ColorMixer.js');
var cm = new ColorMixer();
var _ = require('lodash');
// var _ = require('./lodash.custom.min.js');

var app = angular.module('app', ['ngAnimate']);
app.controller('mixer', ['$scope', '$timeout', mainCtrl]);
app.directive('setColour', function(){
	return {
        scope: {clr: '='},
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
			var cellBroadcastLookup = {
							'mix': 'update-mix',
							'goal': 'update-goal'
						};

			scope.$on(cellBroadcastLookup[tAttrs.cellName],function(evt, args){
				log(tAttrs.cellName)
				log(args)
					$elem.css('background-color', args);
				});

		}
    }
});
app.animation('.clr-item', function (){
	return {
	    enter: function (element, done){
			log('enter');
	    }
	}
});

function mainCtrl($scope, $timeout){

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
		}
		];

	var coloursObj = _.map(colours, function(elem){
		return cm.getColorObject(elem.rgb);
	});

	$scope.colours = _.zipWith(colours, coloursObj, function(item, value) {
	    return _.defaults({ colorObj: value, isSelected: false }, item);
	});

	$scope.defaultColour = cm.getColorObject({r: 0, g: 0, b: 0}).rgbString();
	$scope.currentLevel = 0;
	$scope.levels = [
		{
			id: "One",
			colourCount: 2
		},
		{
			id: "Two",
			colourCount: 3
		},
		{
			id: "Three",
			colourCount: 4
		}
		];

	$scope.GameManager = function(){


	}

	$scope.init = function(){

		$scope.colours = _.map($scope.colours, function(clrObj){
			clrObj.isSelected = false;
			return clrObj;
		});

		$scope.selectedColours = [];
		$scope.unselectedColours = [];
		$scope.numberOfColours = Math.floor(Math.random() * ($scope.colours.length - 3) ) + 2;
		$scope.setGoal($scope.numberOfColours);

		$timeout(function() {
		    $scope.$broadcast("update-mix", cm.getColorObject({r: 221, g: 221, b: 221}).rgbString());
		}, 0);
	}

	$scope.setGoal = function(count){
		$scope.generatedColours = cm.getFewRandom($scope.colours, count);
		$scope.goal = cm.getColorObject(cm.mixColours($scope.generatedColours).colorObj.rgb()).rgbString();
		$timeout(function() {
	    	$scope.$broadcast("update-goal", $scope.goal);
		}, 0);

	}

	$scope.addColour = function(clrObj){
		if( _.includes($scope.selectedColours, clrObj) ) return;
		clrObj.isSelected = true;
		$scope.selectedColours.push(clrObj);
		$scope.unselectedColours = cm.getUnusedItems($scope.colours, $scope.selectedColours);

		//first colour selected, nothing to mix it with!
		if($scope.selectedColours.length == 1){
			$scope.$broadcast("update-mix", clrObj.colorObj.rgbString());
		} else {
	        $scope.$broadcast("update-mix", cm.mixColours($scope.selectedColours).colorObj.rgbString());
		}
	}

	$scope.init();

	$scope.$watch('goal', function(e){});

}

function log(args) {
    console.log(args)
}

function toRgbString(rgbObj) {
	return 'rgb(' + rgbObj.r + ',' + rgbObj.g  + ',' +  rgbObj.b + ')'
}

/*
angular.element(tElem).find('div').css('background-color',toRgbString(JSON.parse(tAttrs.rgb).rgb));

*/