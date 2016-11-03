var ColorMixer = require('./ColorMixer.js');
var cm = new ColorMixer();

var colours = [
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

var selectedColours = cm.getFewRandom(colours, 2);
var mix = cm.mixColours(selectedColours);

log(selectedColours);

log(cm.getUnusedItems(colours, selectedColours));

var pastel = document.getElementsByClassName('pastel')[0];
pastel.style.backgroundColor = mix.rgbString();

function log(args) {
    console.log(args)
}

// var app = angular.module('app', []);