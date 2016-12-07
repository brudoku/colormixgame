'use strict';
var ColorMixer = require( './ColorMixer.js' );
var cm = new ColorMixer();
var _ = require( 'lodash' );
// var _ = require( './lodash.custom.min.js' );
var log = ( function() {
	var log = "";
	return {
		add: function( msg ) {
			log += msg + "\n";
		},
		show: function() {
			console.log( log );
			log = "";
		}
	}
} )();

var app = angular.module( 'app', [ 'ngAnimate' ] );

app.controller( 'mixer', [ '$scope', '$timeout', mainCtrl ] );

app.directive( 'setColour', function() {
	return {
		scope: {
			clr: '='
		},
		link: function( scope, tElem, tAttrs ) {
			var $elem = angular.element( tElem );
			var rgb = toRgbString( JSON.parse( tAttrs.rgb ).rgb );
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
				console.log(evt)
				$elem.css( 'background-color', args );
			} );
		}
	}
} );

app.animation( '.clr-item', function() {
	return {
		enter: function( element, done ) {}
	}
} );

function mainCtrl( $scope, $timeout ) {
	var colours = [ {
		id: 1,
		name: 'violet',
		rgb: {
			r: 148,
			g: 0,
			b: 211
		}
	}, {
		id: 2,
		name: 'indigo',
		rgb: {
			r: 75,
			g: 0,
			b: 130
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

	$scope.levels = [ {
		id: "One",
		colourCount: 2
	}, {
		id: "Two",
		colourCount: 3
	}, {
		id: "Three",
		colourCount: 4
	} ];

	$scope.checkAnswer = function() {
		if ( _.isEqual( sortArrayById( $scope.selectedColours ), sortArrayById( $scope.generatedColours ) ) ) {
			log.add( 'eq!!!' );
		} else {
			log.add( 'no eq' );
		}
		log.show();
	}

	$scope.$on( 'update-mix', function( args ) {
		log.add( 'mix' )
		log.add( args )
		log.show()
	});

	$scope.$on( 'update-goal', function( args ) {
		log.add( 'goal' )
		log.add( args )
		log.show()
	});

	$scope.init = function() {
		$scope.colours = _.map( $scope.colours, function( clrObj ) {
			clrObj.isSelected = false;
			return clrObj;
		} );
		$scope.selectedColours = [];
		$scope.unselectedColours = [];
		$scope.numberOfColours = Math.floor( Math.random() * ( $scope.colours.length - 3 ) ) + 2;
		$scope.setGoal( $scope.numberOfColours );
		$timeout( function() {
			$scope.$broadcast( "update-mix", cm.getColorObject( {
				r: 221,
				g: 221,
				b: 221
			} ).rgbString() );

		}, 0 );
	}
	// $scope.checkAnswer();

	$scope.manager = function() {
		// $scope.levels
	}

	$scope.addColour = function( clrObj ) {
		//if colour has been selected, do nothing.
		if ( _.includes( $scope.selectedColours, clrObj ) ) return;
		// if( $scope.numberOfColours.length <= $scope.selectedColours.length - 1){		}
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

	$scope.init();
	$scope.$watch( 'goal', function( e ) {} );

}

function toRgbString( rgbObj ) {
	return 'rgb(' + rgbObj.r + ',' + rgbObj.g + ',' + rgbObj.b + ')'
}
/*
angular.element(tElem).find('div').css('background-color',toRgbString(JSON.parse(tAttrs.rgb).rgb));

*/