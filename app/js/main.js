'use strict';
var ColorMixer = require('./ColorMixer.js');
var cm = new ColorMixer();
// var _ = require( 'lodash' );
// var _ = require('./lodash.custom.min.js');
var log = (function() {
	return function(msg) {
		console.log(msg);
	}
}());
var app = angular.module('app', ['ngAnimate']);
mainCtrl.$inject = ['$scope', '$timeout'];
app.controller('mixer', mainCtrl);
app.directive('setColour', function() {
	return {
		scope: {
			clr: '='
		},
		link: function(scope, tElem, tAttrs) {
			var $elem = angular.element(tElem);
			var rgb = tAttrs.rgb ? toRgbString(JSON.parse(tAttrs.rgb).rgb) : 'rgb(0,0,0)';
			$elem.find('div').css('background-color', rgb);
		}
	}
});
app.directive('updateColour', function() {
	return {
		link: function(scope, tElem, tAttrs) {
			var $elem = angular.element(tElem);
			var cellBroadcastLookup = {
				'mix': 'update-mix',
				'goal': 'update-goal'
			};
			scope.$on(cellBroadcastLookup[tAttrs.cellName], function(evt, args) {
				$elem.css('background-color', args);
			});
		}
	}
});
app.animation('.anim-clr-elem', function($timeout) {
	return {
		enter: function(element, done) {
			var $elem = $(element);
			$elem.css('position', 'relative');
			$elem.snabbt({
				easing: 'spring',
				springConstant: 0.8,
				springDeceleration: 0.8,
				springMass: 10,
				opacity: 1,
				fromOpacity: 0,
				fromPosition: [0, 100, 0],
				position: [0, 0, 0],
				duration: 250,
				fromScale: [0.5, 0.5],
				scale: [1, 1]
			});
			$timeout(function() {
				done();
			}, 500)
		},
		leave: function(element, done) {
			var $elem = $(element);
			$elem.css('display', 'none');
			$timeout(function() {
				done();
			}, 500)
		},
		addClass:function(element){
var $elem = $(element);
			// $elem.css('position', 'relative');
			$elem.snabbt({
				easing: 'spring',
				springConstant: 0.8,
				springDeceleration: 0.8,
				springMass: 10,
				opacity: 1,
				fromOpacity: 0,
				fromPosition: [0, 100, 0],
				position: [0, 0, 0],
				duration: 250,
				fromScale: [0.5, 0.5],
				scale: [1, 1]
			});			
		}
	}
})
app.directive('highlight', function(){})



app.directive('shakediv',function($animate, $timeout) {
 return {
 link: function(scope, elem, attrs) {
 	scope.generateRandom = function() {
		var $el = elem.find('.my-animation-class');
		scope.randomValue = Math.random().toFixed(2);
		if (scope.randomValue > 0.5) { //if >0.5 add the class
			// $el.addClass('make');
			$animate.addClass(elem.find('.my-animation-class'),'make');
			$timeout(function() {
				$animate.removeClass(elem.find('.my-animation-class'),'make');
			// $el.removeClass('make');

			}, 1000);
		}
	}
 },
 template: '<input type="button" ng-click="generateRandom()" value="Generate Random Value"/><h2 class="my-animation-class">xxx{{randomValue}}</h2>'
 }
});

function mainCtrl($scope, $timeout) {
	var colours = [
		{
			id: 1,
			name: 'violet'
		}, {
			id: 3,
			name: 'blue'
		}, {
			id: 4,
			name: 'green'
		}, {
			id: 5,
			name: 'yellow'
		}, {
			id: 6,
			name: 'orange'
		}
		/*, {
					id: 7,
					name: 'red'
				}*/
	];
	var colourVars = [
		{
			rgb: [{
				r: 247,
				g: 0,
				b: 48
			}, {
				r: 199,
				g: 33,
				b: 106
			}, {
				r: 171,
				g: 28,
				b: 139
			}]
		}, {
			rgb: [{
				r: 1,
				g: 167,
				b: 182
			}, {
				r: 5,
				g: 109,
				b: 189
			}, {
				r: 6,
				g: 84,
				b: 191
			}]
		}, {
			rgb: [{
				r: 124,
				g: 205,
				b: 13
			}, {
				r: 27,
				g: 183,
				b: 11
			}, {
				r: 144,
				g: 209,
				b: 13
			}]
		}, {
			rgb: [{
				r: 214,
				g: 202,
				b: 26
			}, {
				r: 255,
				g: 221,
				b: 0
			}, {
				r: 227,
				g: 200,
				b: 28
			}]
		}, {
			rgb: [{
				r: 255,
				g: 73,
				b: 0
			}, {
				r: 255,
				g: 95,
				b: 0
			}, {
				r: 255,
				g: 116,
				b: 0
			}]
		}
		/*,
				{
					name: 'red',
					rgb: [{r: 255,g: 23,b: 23}, {r: 224,g: 47,b: 14}, {r: 215,g: 13,b: 37}]
				}*/
	];
	$scope.levels = [
		{
			id: 1,
			colourCount: 2
		}, {
			id: 1,
			colourCount: 2
		}, {
			id: 1,
			colourCount: 2
		}, {
			id: 2,
			colourCount: 3
		}, {
			id: 2,
			colourCount: 3
		}, {
			id: 2,
			colourCount: 3
		}, {
			id: 3,
			colourCount: 4
		}, {
			id: 3,
			colourCount: 4
		}, {
			id: 3,
			colourCount: 4
	}];
	$scope.currentLevel = 0;
	$scope.initColours = function() {
		var colourShades = _.zipWith(colours, colourVars, function(colorData, colorVar) {
			var colorShade = colorVar.rgb[_.random(0, colorVar.rgb.length - 1)];
			colorData.rgb = colorShade;
			return colorData;
		});
		var coloursObj = _.map(colourShades, function(elem) {
			return cm.getColorObject(elem.rgb);
		});
		$scope.colours = _.shuffle(_.zipWith(colourShades, coloursObj, function(color, colorObj) {
			return _.defaults({
				colorObj: colorObj,
				isSelected: false
			}, color);
		}));
	}
	$scope.getCurrentScore = function(){
		return $scope.levels[$scope.currentLevel].score + '/' + $scope.levels[$scope.currentLevel].colourCount;
	}
	$scope.getTotalScore = function(){
		var totalScore = _.reduce($scope.levels, function(sum, item){
			if (!item.score){ return sum}
			return  {colourCount: item.colourCount + sum.colourCount, score: item.score + sum.score}
		});

		return totalScore.score + '/' + totalScore.colourCount;
	}
	$scope.isGameFinished = function(){
		return $scope.currentLevel == $scope.levels.length - 1;
	}
	$scope.getCurrentLevelName = function() {
		return $scope.levels[$scope.currentLevel].id + ' of ' + $scope.levels[$scope.levels.length-1].id
	}
	$scope.getCurrentCount = function() {
		return $scope.levels[$scope.currentLevel].colourCount
	}
	//resets to first round if all current levels are done
	$scope.nextRound = function() {
		if($scope.isGameFinished()){
			$timeout(function() {
				location.hash = '#end-of-game';
			}, 500);
		}
		if ($scope.currentLevel < $scope.levels.length - 1) {
			$scope.currentLevel++;
			$scope.initBoard($scope.levels[$scope.currentLevel]);
		} else {
			$scope.currentLevel = 0;
			$scope.initBoard($scope.levels[$scope.currentLevel]);
		}
	}
	$scope.isCorrect = function() {
		return _.isEqual(sortArrayById($scope.selectedColours), sortArrayById($scope.generatedColours));
	}
	$scope.calculateScore = function() {
		var wrongUns = _.difference(sortArrayById($scope.selectedColours), sortArrayById($scope.generatedColours)).length;
		var total = $scope.levels[$scope.currentLevel].colourCount;
		return Math.abs(wrongUns - total);
	}
	$scope.isRoundComplete = function() {
		var isComplete = ($scope.selectedColours.length == $scope.numberOfColours) && $scope.selectedColours.length > 0;
		if (isComplete) $scope.$broadcast('round-complete', isComplete);
		return isComplete;
	}
	$scope.initBoard = function(levelObj) {
		var levelObject = levelObj ? levelObj : $scope.levels[0];
		$scope.initColours();
		$scope.selectedColours = [];
		$scope.unselectedColours = [];
		$scope.numberOfColours = levelObject.colourCount;
		setGoal($scope.numberOfColours);
		$timeout(function() {
			$scope.$broadcast("update-mix", cm.getColorObject({
				r: 221,
				g: 221,
				b: 221
			}).rgbString());
		}, 0);
	}
	$scope.addColour = function(clrObj) {
		//if colour has been selected, do nothing.
		if (_.includes($scope.selectedColours, clrObj)) return;
		clrObj.isSelected = true;
		$scope.selectedColours.push(clrObj);
		$scope.unselectedColours = cm.getUnusedItems($scope.colours, $scope.selectedColours);
		//if this is the first colour is selected, publish as is.
		if ($scope.selectedColours.length == 1) {
			$scope.$broadcast("update-mix", clrObj.colorObj.rgbString());
		} else {
			//else mix all selected colours
			$scope.$broadcast("update-mix", cm.mixColours($scope.selectedColours).colorObj.rgbString());
		}
	}
	function setGoal(count) {
		$scope.generatedColours = cm.getFewRandom($scope.colours, count);
		$scope.goal = cm.getColorObject(cm.mixColours($scope.generatedColours).colorObj.rgb()).rgbString();
		$timeout(function() {
			$scope.$broadcast("update-goal", $scope.goal);
		}, 0);
	}
	var sortArrayById = (function() {
		return function(array) {
			return _.sortBy(array, function(clrObj) {
				return clrObj.id;
			})
		}
	})();
	$scope.showHint = function(){
		log('showHint');
		/*
			get random unselectedcolour
			broadcast 'hint' and id

		*/
	}
	$scope.$on('round-complete', function(args) {
		$timeout(function() {
			location.hash = '#end-of-round';
		}, 500);
		$scope.levels[$scope.currentLevel].score = $scope.calculateScore();

	});
	$scope.$on('update-mix', function(args) {
		$scope.isRoundComplete();
		$scope.isCorrect();
	});
	$scope.initBoard($scope.levels[$scope.currentLevel]);
}

function toRgbString(rgbObj) {
	return 'rgb(' + rgbObj.r + ',' + rgbObj.g + ',' + rgbObj.b + ')'
}


