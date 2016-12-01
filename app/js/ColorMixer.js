'use strict';
// var _ = require('lodash');
var Color = require('color');
var rgb2ryb = require('rgb2ryb');
var rybColorMixer = require('ryb-color-mixer');
var _ = require('./lodash.custom.min.js');

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
	// getColor: function(list){
	// 	return { colorObj: Color().rgb(mixed) };
	// },
	mixColours: function(list){
		var hexList = _.map(list, function(item){
			return rgb2ryb(item.colorObj.rgbArray());
		})
		var mixed = rybColorMixer.mix(hexList,  { result: "rgb", hex: false });
		return { colorObj: Color().rgb(mixed) };
	},
	/*
		mixColours: function(list){
			return _.reduce(list, function(item1, item2){
				var firstColor = rgb2ryb(item1.colorObj.rgbArray());
				var secondColor = rgb2ryb(item2.colorObj.rgbArray());
				var rybMix = rybColorMixer.mix(firstColor, secondColor,  { result: "rgb", hex: false });
				return { colorObj: Color().rgb(rybMix) };
			});
		},
	*/

	getUnusedItems: function(list, selected){
		return _.differenceWith(list, selected, _.isEqual);
	},
	getColorObject: function(rgbObj){
		return Color(rgbObj);
	}
}

module.exports = ColorMixer;
