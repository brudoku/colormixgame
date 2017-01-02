'use strict';
var ColorMixer = require( './ColorMixer.js' );
var cm = new ColorMixer();
var _ = require( 'lodash' );
// var _ = require( './lodash.custom.min.js' );

var log = (function (){
	return function(msg){
		console.log(msg);
	}
}());

var app = angular.module( 'app', [ 'ngAnimate' ] );

mainCtrl.$inject = ['$scope', '$timeout'];

app.controller( 'mixer', mainCtrl );

app.directive( 'setColour', function() {
	return {
		scope: {
			clr: '='
		},
		link: function( scope, tElem, tAttrs ) {
			var $elem = angular.element( tElem );
			var rgb = tAttrs.rgb ? toRgbString( JSON.parse( tAttrs.rgb ).rgb ) : 'rgb(0,0,0)';
			$elem.find( 'div' ).css( 'background-color', rgb );
		}
	}
});

app.directive( 'updateColour', function() {
	return {
		link: function( scope, tElem, tAttrs ) {
			var $elem = angular.element( tElem );
			var cellBroadcastLookup = {
				'mix': 'update-mix',
				'goal': 'update-goal'
			};
			scope.$on( cellBroadcastLookup[ tAttrs.cellName ], function( evt, args ) {
				$elem.css( 'background-color', args );
			} );
		}
	}
});

app.animation('.repeated', function ($timeout){
  console.log('anim')

  return {
    enter: function (element, done){
		var $elem = $(element);
	    $elem.css('z-index',100);
		$elem.snabbt({
			easing:'easeIn',
			opacity: 1,
			fromOpacity: 0,
			fromPosition: [0,100,0],
			position: [0,0,0],
			duration: 250
		});
		$timeout(function(){
			done();
		},500)
    },
    leave: function(element, done){
		var $elem = $(element);
	    $elem.css('z-index',100);
		$elem.snabbt({
			easing:'easeIn',
			opacity: 0,
			fromOpacity: 1,
			fromPosition: [0,0,0],
			position: [0,100,0],
			duration: 250
		});
		$timeout(function(){
			done();
		},500)
    }
  }
})

function mainCtrl( $scope, $timeout ) {

	var colours = [
		{
			id: 1,
			name: 'violet',
			rgb: {
				r: 148,
				g: 0,
				b: 211
			}
		}, {
			id: 3,
			name: 'blue',
			rgb: {
				r: 0,
				g: 0,
				b: 255
			}
		}, {
			id: 4,
			name: 'green',
			rgb: {
				r: 0,
				g: 255,
				b: 0
			}
		}, {
			id: 5,
			name: 'yellow',
			rgb: {
				r: 255,
				g: 255,
				b: 0
			}
		}, {
			id: 6,
			name: 'orange',
			rgb: {
				r: 255,
				g: 127,
				b: 0
			}
		}, {
			id: 7,
			name: 'red',
			rgb: {
				r: 255,
				g: 0,
				b: 0
			}
		} ];

var colours2 = [
		{
			id: 7,
			name: 'red'
		}, {
			id: 3,
			name: 'blue'
		}];


	var colourVars = [
			{
				name: 'violet',
				rgb: [	{r: 148,g: 0,b: 211}, {r: 148,g: 29,b: 181}, {r: 130,g: 29,b: 229}]
			},
			{
				name: 'blue',
				rgb: [{r: 0,g: 0,b: 255}, {r: 0,g: 20,b: 255}, {r: 20,g: 10,b: 255}]
			},
			{
				name: 'green',
				rgb: [{r: 0,g: 255,b: 0}, {r: 29,g: 255,b: 29}, {r: 57,g: 255,b: 37}]
			},
			{
				name: 'yellow',
				rgb: [{r: 0,g: 255,b: 255}, {r: 27,g: 255,b: 227}, {r: 10,g: 255,b: 188}]
			},
			{
				name: 'orange',
				rgb: [{r: 255,g: 127,b: 0}, {r: 255,g: 100,b: 27}, {r: 255,g: 117,b: 77}]
			},
			{
				name: 'red',
				rgb: [{r: 255,g: 0,b: 0}, {r: 255,g: 100,b: 0}, {r: 255,g: 100,b: 100}]
			}
		];

var colours3 = _.zipWith( colours, colourVars, function(colorData, colorVar){
	log(colorVar)
	var colorShade = colorVar.rgb[_.random(0,colorVar.rgb.length)];
	colorData.rgb = colorShade;
	return colorData;
});

log(colours3)

	var coloursObj = _.map( colours, function( elem ) {
		return cm.getColorObject( elem.rgb );
	} );

	$scope.colours = _.zipWith( colours, coloursObj, function( color, colorObj ) {
		return _.defaults( {
			colorObj: colorObj,
			isSelected: false
		}, color );
	} );

	$scope.currentLevel = 0;

	$scope.levels = [
		{
			id: "One",
			colourCount: 2
		},{
			id: "One",
			colourCount: 2
		},{
			id: "One",
			colourCount: 2
		}, {
			id: "Two",
			colourCount: 3
		}, {
			id: "Two",
			colourCount: 3
		}, {
			id: "Two",
			colourCount: 3
		}, {
			id: "Three",
			colourCount: 4
		}, {
			id: "Three",
			colourCount: 4
		}, {
			id: "Three",
			colourCount: 4
		}];

	$scope.getCurrentLevelName = function(){
		return $scope.levels[$scope.currentLevel].id
	}

	$scope.getCurrentCount = function(){
		return $scope.levels[$scope.currentLevel].colourCount
	}

	$scope.nextRound = function(){
		if($scope.currentLevel < $scope.levels.length - 1){
			$scope.currentLevel++;
			$scope.initBoard($scope.levels[$scope.currentLevel]);
		} else {
			$scope.currentLevel = 0;
			$scope.initBoard($scope.levels[$scope.currentLevel]);
		}
	}

	$scope.isCorrect = function(){
		return _.isEqual( sortArrayById( $scope.selectedColours ), sortArrayById( $scope.generatedColours ) );
	}

	$scope.isRoundComplete = function(){
		var isComplete = ($scope.selectedColours.length == $scope.numberOfColours) && $scope.selectedColours.length > 0;
		if(isComplete) $scope.$broadcast('round-complete', isComplete);
		return isComplete;
	}

	$scope.initBoard = function(levelObj) {
		var levelObject = levelObj ? levelObj : $scope.levels[0];
		$scope.colours = _.map( $scope.colours, function( clrObj ) {
			clrObj.isSelected = false;
			return clrObj;
		} );
		$scope.selectedColours = [];
		$scope.unselectedColours = [];
		$scope.numberOfColours = levelObject.colourCount;
		setGoal( $scope.numberOfColours );
		$timeout( function() {
			$scope.$broadcast( "update-mix", cm.getColorObject( {
				r: 221,
				g: 221,
				b: 221
			} ).rgbString() );
		}, 0 );
	}

	$scope.addColour = function( clrObj ) {
		//if colour has been selected, do nothing.
		if ( _.includes( $scope.selectedColours, clrObj ) ) return;
		clrObj.isSelected = true;
		$scope.selectedColours.push( clrObj );
		$scope.unselectedColours = cm.getUnusedItems( $scope.colours, $scope.selectedColours );
		//if this is the first colour is selected, publish as is.
		if ( $scope.selectedColours.length == 1 ) {
			$scope.$broadcast( "update-mix", clrObj.colorObj.rgbString() );
		} else {
			//else mix all selected colours
			$scope.$broadcast( "update-mix", cm.mixColours( $scope.selectedColours ).colorObj.rgbString() );
		}
	}

	function setGoal( count ) {
		$scope.generatedColours = cm.getFewRandom( $scope.colours, count );
		$scope.goal = cm.getColorObject( cm.mixColours( $scope.generatedColours ).colorObj.rgb() ).rgbString();
		$timeout( function() {
			$scope.$broadcast( "update-goal", $scope.goal );
		}, 0 );
	}

	var sortArrayById = ( function() {
		return function( array ) {
			return _.sortBy( array, function( clrObj ) {
				return clrObj.id;
			} )
		}
	} )();

	$scope.$on( 'round-complete', function( args ) {
		$timeout(function() {
		location.hash = '#modal';
		}, 500);
	});

	$scope.$on( 'update-mix', function( args ) {
		$scope.isRoundComplete();
		$scope.isCorrect();
	});

	$scope.initBoard($scope.levels[$scope.currentLevel]);

}

function toRgbString( rgbObj ) {
	log('rgbObj')

	log(rgbObj)
	return 'rgb(' + rgbObj.r + ',' + rgbObj.g + ',' + rgbObj.b + ')'
}