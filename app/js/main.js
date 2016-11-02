'use strict';
var _ = require('lodash');
var Color = require('color');

var colors = [
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
	}];

function getFewRandom(list, count){
	var list = _.clone(list);
	return _.map(_.range(count), function(item){
		var rand = getRandom(list);
		list.splice(_.indexOf(list,rand),1);
		return rand;
	});
}

function getRandom(list){
	var elem = _.random(list.length - 1);
	var ret = list.slice(elem, elem+1)[0];
	return ret;
}

function mixColors(list){
	return _.reduce(list, function(item1, item2){
		return Color(item1.rgb).mix(Color(item2.rgb));
	});
}


var mix = mixColors(getFewRandom(colors, 2));

var pastel = document.getElementsByClassName('pastel')[0];
pastel.style.backgroundColor = mix.rgbString();

function log(args) {
    console.log(args)
}