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
app.config(function(ngModalDefaultsProvider) {
  return ngModalDefaultsProvider.set({
    closeButtonHtml: "<i class='fa fa-times'></i>"
  });
});
app.controller( 'mixer', [ '$scope', '$timeout', mainCtrl ] );

app.directive( 'setColour', function() {
	return {
		scope: {
			clr: '='
		},
		link: function( scope, tElem, tAttrs ) {
			var $elem = angular.element( tElem );
			var rgb = tAttrs.rgb ? toRgbString( JSON.parse( tAttrs.rgb ).rgb ) : 'rgb(0,0,0)';
			// log('rgb');
			// log($elem)
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
				// log(evt)
				$elem.css( 'background-color', args );
			} );
		}
	}
} );

app.provider("ngModalDefaults", function() {
	return {
	  options: {
	    closeButtonHtml: "<span class='ng-modal-close-x'>X</span>"
	  },
	  $get: function() {
	    return this.options;
	  },
	  set: function(keyOrHash, value) {
	    var k, v, _results;
	    if (typeof keyOrHash === 'object') {
	      _results = [];
	      for (k in keyOrHash) {
	        v = keyOrHash[k];
	        _results.push(this.options[k] = v);
	      }
	      return _results;
	    } else {
	      return this.options[keyOrHash] = value;
	    }
	  }
	};
});

app.directive('modalDialog', ['ngModalDefaults', '$sce', function(ngModalDefaults, $sce) {
  return {
    restrict: 'E',
    scope: {
      show: '=',
      dialogTitle: '@',
      onClose: '&?'
    },
    replace: true,
    transclude: true,
    link: function(scope, element, attrs) {
      var setupCloseButton, setupStyle;
      setupCloseButton = function() {
        return scope.closeButtonHtml = $sce.trustAsHtml(ngModalDefaults.closeButtonHtml);
      };
      setupStyle = function() {
        scope.dialogStyle = {};
        if (attrs.width) {
          scope.dialogStyle['width'] = attrs.width;
        }
        if (attrs.height) {
          return scope.dialogStyle['height'] = attrs.height;
        }
      };
      scope.hideModal = function() {
        return scope.show = false;
      };
      scope.$watch('show', function(newVal, oldVal) {
        if (newVal && !oldVal) {
          document.getElementsByTagName("body")[0].style.overflow = "hidden";
        } else {
          document.getElementsByTagName("body")[0].style.overflow = "";
        }
        if ((!newVal && oldVal) && (scope.onClose != null)) {
          return scope.onClose();
        }
      });
      setupCloseButton();
      return setupStyle();
    },
    template: "<div class='ng-modal' ng-show='show'>\n  <div class='ng-modal-overlay' ng-click='hideModal()'></div>\n  <div class='ng-modal-dialog' ng-style='dialogStyle'>\n    <span class='ng-modal-title' ng-show='dialogTitle && dialogTitle.length' ng-bind='dialogTitle'></span>\n    <div class='ng-modal-close' ng-click='hideModal()'>\n      <div ng-bind-html='closeButtonHtml'></div>\n    </div>\n    <div class='ng-modal-dialog-content' ng-transclude></div>\n  </div>\n</div>"
  };
}]);

app.animation( '.clr-item', function() {
	return {
	enter: function( element, done ) {}
	}
});

function mainCtrl( $scope, $timeout ) {
/*
	$scope.myData = {
		link: "http://google.com",
		modalShown: false,
		hello: 'world',
		foo: 'bar'
	};
	$scope.logClose = function() {
		console.log('close!');
	};

	$scope.toggleModal = function() {
		// log('toggleModal'  +$scope.myData.modalShown);
		// $scope.myData.modalShown = !$scope.myData.modalShown;
	};
*/
	var colours = [
		{
			id: 1,
			name: 'violet',
			rgb: {
				r: 148,
				g: 0,
				b: 211
			}
		} /*{
			id: 2,
			name: 'indigo',
			rgb: {
				r: 75,
				g: 0,
				b: 130
			}
		}*/, {
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
		// ($scope.selectedColours.length == $scope.numberOfColours) ?  : $scope.broadcast('round-complete', true);
	}

	$scope.$on( 'round-complete', function( args ) {
		log('round-complete');
		location.hash = '#modalx';
	});

	$scope.$on( 'update-mix', function( args ) {
		log('update-mix');
		$scope.isRoundComplete();
		$scope.isCorrect();
	});

	$scope.$on( 'update-goal', function( args ) {
	});

	$scope.initBoard = function() {
		$scope.colours = _.map( $scope.colours, function( clrObj ) {
			clrObj.isSelected = false;
			return clrObj;
		} );
		$scope.selectedColours = [];
		$scope.unselectedColours = [];
		$scope.numberOfColours = Math.floor( Math.random() * ( $scope.colours.length - 6 ) ) + 2;
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

	$scope.initBoard();

}

function toRgbString( rgbObj ) {
	return 'rgb(' + rgbObj.r + ',' + rgbObj.g + ',' + rgbObj.b + ')'
}
/*
angular.element(tElem).find('div').css('background-color',toRgbString(JSON.parse(tAttrs.rgb).rgb));

*/
$('#mod').on('click', function(e,arg){
	log('clk')
	log(e)
	log(arg)
	log('--')
})