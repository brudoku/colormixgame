'use strict';
var _ = require('lodash');
var Color = require('color');

var colors = [{
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

var clrRed = Color(getRandom(colors).rgb);
var clrBlue = Color(getRandom(colors).rgb);
var mix = clrRed.mix(Color(clrBlue.rgb())).lighten(0.5);

// var pastel = document.getElementsByClassName('pastel')[0];
// pastel.style.backgroundColor = clrRed.rgbString();

function getManyRandom(list, count){
	var list = list;
	return _.map(_.range(count), function(item){
		var rand = getRandom(list);
		list.splice(_.indexOf(list,rand),1);
		return rand;
	});
}

getManyRandom(colors, 6);

function getRandom(list){
	var elem = _.random(0, list.length);
	return list.slice(elem-1, elem)[0];
}

function log(msg){
  console.log(msg);
}
