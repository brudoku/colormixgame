'use strict';
var ColorMixer = require( './ColorMixer.js' );
var cm = new ColorMixer();
// var _ = require( 'lodash' );
var _ = require( './lodash.custom.min.js' );

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
} );

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
} );

app.animation( '.clr-item', function() {
	return {
	enter: function( element, done ) {}
	}
});
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

	var coloursObj = _.map( colours, function( elem ) {
		return cm.getColorObject( elem.rgb );
	} );

	$scope.colours = _.zipWith( colours, coloursObj, function( item, value ) {
		return _.defaults( {
			colorObj: value,
			isSelected: false
		}, item );
	} );

	$scope.defaultColour = cm.getColorObject( {
		r: 0,
		g: 0,
		b: 0
	} ).rgbString();

	$scope.currentLevel = 0;

	$scope.levels = [
		{
			id: "One",
			colourCount: 2
		}, {
			id: "Two",
			colourCount: 3
		}, {
			id: "Three",
			colourCount: 4
		}];

	function loadLevel(){
		return $scope.levels[$scope.currentLevel];
	}

	$scope.getCurrentLevel = function(){
		return $scope.levels[$scope.currentLevel].id
	}

	$scope.nextRound = function(){
		if($scope.currentLevel <= $scope.levels.length){
			$scope.initBoard($scope.levels[$scope.currentLevel]);
			$scope.currentLevel++;
		} else {
			$scope.currentLevel = 0;
			$scope.initBoard($scope.levels[$scope.currentLevel]);

		}
	}

	$scope.isCorrect = function(){
		if ( _.isEqual( sortArrayById( $scope.selectedColours ), sortArrayById( $scope.generatedColours ) ) ) {
		} else {
		}
		return _.isEqual( sortArrayById( $scope.selectedColours ), sortArrayById( $scope.generatedColours ) );
	}

	$scope.isRoundComplete = function(){
		var isComplete = ($scope.selectedColours.length == $scope.numberOfColours) && $scope.selectedColours.length > 0;
		if(isComplete) $scope.$broadcast('round-complete', isComplete);
		return isComplete;
	}

	$scope.$on( 'round-complete', function( args ) {
		location.hash = '#modal';
	});

	$scope.$on( 'update-mix', function( args ) {
		$scope.isRoundComplete();
		$scope.isCorrect();
	});

	$scope.$on( 'update-goal', function( args ) {
	});

	$scope.initBoard = function(levelObj) {
		$scope.colours = _.map( $scope.colours, function( clrObj ) {
			clrObj.isSelected = false;
			return clrObj;
		} );
		$scope.selectedColours = [];
		$scope.unselectedColours = [];
		$scope.numberOfColours = Math.floor( Math.random() * ( $scope.colours.length - 6 ) ) + 2;
		$scope.numberOfColours = levelObj.colourCount;
		$scope.setGoal( $scope.numberOfColours );
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
		//if this is the first colour is selected, publish rather than mix.
		if ( $scope.selectedColours.length == 1 ) {
			$scope.$broadcast( "update-mix", clrObj.colorObj.rgbString() );
		} else {
			//else mix all selected colours
			$scope.$broadcast( "update-mix", cm.mixColours( $scope.selectedColours ).colorObj.rgbString() );
		}
	}

	$scope.setGoal = function( count ) {
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

	$scope.nextRound();

}

function toRgbString( rgbObj ) {
	return 'rgb(' + rgbObj.r + ',' + rgbObj.g + ',' + rgbObj.b + ')'
}
