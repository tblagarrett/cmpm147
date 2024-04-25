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

let positions = {}
let worldSeed

function p3_preload() {}

function p3_setup() {
}

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 32;
}

function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_drawBefore() {
  background(0);
}

function p3_tileClicked(i, j) {
  // Record the time of the click
  const clickTime = millis();
}

function p3_drawTile(i, j) {
  // Get the base color for the tile
  if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
    fill(240, 200);
  } else {
    fill(255, 200);
  }

  if (positions[i + ',' + j]) {
    positions[i + ',' + j] += 1
    translate(0, positions[i + ',' + j])

    if (positions[i + ',' + j] > 50) {
      noFill()
    }
  }

  // Render the tile with final blended color
  noStroke();
  push();
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  pop();
}

function p3_drawSelectedTile(i, j) {
  if (!positions[i + ',' + j]) {
    positions[i + ',' + j] = 1; // Initialize position if it doesn't exist
  }
}

function p3_drawAfter() {}

function sinAt(x, freq = 0.3, scale = 4) {
  return Math.sin(x * freq) * scale;
}

