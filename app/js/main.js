// 'use strict';

var Color = require('color');
clrRed = Color({r:255, g:0, b:0});
clrBlue = Color({r:0, g:0, b:255});

var strRed = getColorString(clrRed.rgbArray());
var strBlue = getColorString(clrBlue.rgbArray());
var mix = clrRed.mix(Color(clrBlue.rgb()));

var pastel = document.getElementsByClassName('pastel')[0];
pastel.style.backgroundColor = mix.rgbString();
log(mix.rgbString())

function getColorString (rgbArray) {
  return 'rgb(' + rgbArray[0] + ',' + rgbArray[1]  + ',' + rgbArray[2] + ')';
}

function log(msg){
  console.log(msg);
}