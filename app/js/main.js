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
	// return _.reduce(list, function(item1, item2){
		var clr1 = Color(list[2].rgb);
		var clr2 = Color(list[6].rgb);
		var mx = clr1.mix(Color(clr2.rgb));

		var mix = mx.rgb();
		log(clr1.rgb())
		log(clr2.rgb())

		// log('clr1===');
		// log(clr1.rgb());
		// log('clr2*****');
		// log(clr2.rgb());
		// log('mix*****');
		log(mix);
		return mix;
	// });
}

mixColors(colors);

// var mixx = mixColors([ colors[2], colors[6] ]);
// log(mixx)
// var clrRed = Color(getRandom(colors).rgb);
// var clrBlue = Color(getRandom(colors).rgb);
// var mix = clrRed.mix(Color(clrBlue.rgb())).lighten(0.5);
// var pastel = document.getElementsByClassName('pastel')[0];
// pastel.style.backgroundColor = mixx.rgbString();

function log(args) {
    console.log(args)
}

// log(getFewRandom(colors, 5));

var list = [1,2,3,4,5, 6];
// _.reduce(list, function(sum,n){
// 	log('sum: ' + sum);
// 	log('n: ' + n);
// 	return sum + n;
// });

function mixit(num1, num2){
	return num1+0+num2;
}

// function mixEm(list){
// 	return _.reduce(list, function(item1, item2, key){
// 		var mix = mixit(item1,item2);
// 		// log('************item1');
// 		// log(item1);
// 		// log('************item2');
// 		// log(item2);
// 		// log('************mix');
// 		// log(mix);
// 		return mix;
// 	});
// }

// log('ave:'+mixEm(list))
// ************item1
// 1
// ************item2
// 2
// ************mix
// 1#2
// ************item1
// 1#2
// ************item2
// 3
// ************mix
// 1#2#3