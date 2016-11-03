'use strict';
var _ = require('lodash');
var Color = require('color');

var ColorMixer = function(){
	return this;
}

ColorMixer.prototype = {
	getFewRandom: function(list, count){
		var list = _.clone(list);
		var self = this;
		return _.map(_.range(count), function(item){
			var rand = self.getRandom(list);
			list.splice(_.indexOf(list,rand),1);
			return rand;
		});
	},
	getRandom: function(list){
		var elem = _.random(list.length - 1);
		var ret = list.slice(elem, elem+1)[0];
		return ret;
	},
	mixColours: function(list){
		return _.reduce(list, function(item1, item2){
			return Color(item1.rgb).mix(Color(item2.rgb));
		});
	},
	getUnusedItems: function(list, selected){
		return _.differenceWith(list, selected, _.isEqual);
	}
}

module.exports = ColorMixer;
