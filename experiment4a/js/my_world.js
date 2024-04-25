"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

function p3_preload() {}

function p3_setup() {}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 16;
}
function p3_tileHeight() {
  return 8;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}

function p3_drawBefore() { background(0) }

function p3_drawTile(i, j) {
  noStroke();
  // if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
  //   fill(240, 200);
  // } else {
  //   fill(255, 200);
  // }

  // Apply noise to the coloring
  let value = noiseAt(i, j)
  switch (true) {
    case value < 0.35:  // Water
      fill("#3496c7")
      translate(0, sinAt(i + (millis() * .005)))
      break
    case value > 0.55:  // Mountains
      let mountainBase = [100, 100, 100]
      let mountainPeak = [255, 255, 255]

      fill(getColorBetweenBounds(mountainBase, mountainPeak, .55, .7, value))
      translate(0, (-value + .50) * 400)
      break
    default:            // Land
      let color1 = [247, 220, 121]; // RGB values for #f7dc79
      const color2 = [61, 117, 28]; // RGB values for #3d751c

      fill(getColorBetweenBounds(color1, color2, .35, .55, value))
      translate(0, (-value + .35) * 100)
  }

  push();

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  // let n = clicks[[i, j]] | 0;
  // if (n % 2 == 1) {
  //   fill(0, 0, 0, 32);
  //   ellipse(0, 0, 10, 5);
  //   translate(0, -10);
  //   fill(255, 255, 100, 128);
  //   ellipse(0, 0, 10, 10);
  // }

  pop();
}

function p3_drawSelectedTile(i, j) {
  // noFill();
  // stroke(0, 255, 0, 128);

  // beginShape();
  // vertex(-tw, 0);
  // vertex(0, th);
  // vertex(tw, 0);
  // vertex(0, -th);
  // endShape(CLOSE);

  // noStroke();
  // fill(0);
  // text("tile " + [i, j], 0, 0);
}

function p3_drawAfter() {}

function noiseAt(y, x, layers=1, zoom=.05) {
  let value = 0;
  for (let i = 1; i <= layers; i++) {
    let power = Math.pow(i, 2)
    value += 1/(power) * noise(power * y * zoom, power * x * zoom)
  }
  return value
}

function sinAt(x, freq = .3, scale = 4) {
  return Math.sin(x * freq) * scale
}


// Functions below written by ChatGPT for blending between colors


function lerpTheseColors(color1, color2, amount) {
  const r = Math.round(color1[0] + (color2[0] - color1[0]) * amount);
  const g = Math.round(color1[1] + (color2[1] - color1[1]) * amount);
  const b = Math.round(color1[2] + (color2[2] - color1[2]) * amount);
  return `rgb(${r},${g},${b})`;
}

function getColorBetweenBounds(color1, color2, minBound, maxBound, currentValue) {
  // Normalize the currentValue between 0 and 1 based on minBound and maxBound
  const amount = (currentValue - minBound) / (maxBound - minBound);
  
  // Interpolate between the two colors using the normalized value
  return lerpTheseColors(color1, color2, amount);
}