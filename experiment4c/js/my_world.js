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

let worldSeed

function p3_preload() {}

function p3_setup() {
}

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  tileState = {}
}

function p3_tileWidth() {
  return 32;
}

function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

function p3_drawBefore() {
  background(0);
}

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
}

let tileState = {}; // Object to store the state of each tile
let lastUpdateFrame = 0; // Keep track of the last frame when tile states were updated

function p3_drawTile(i, j) {
  // Initialize tile state if not already initialized
  if (!tileState.hasOwnProperty([i, j])) {
    let downtime = Math.floor(random(4, 101)); // Random downtime between 4 and 100
    let lifespan = Math.floor(random(1, 16)); // Random lifespan between 1 and 15
    tileState[[i, j]] = {
      downtime: downtime,
      lifespan: lifespan,
      clicks: random() < 0.99 ? 0 : 1 // Randomly assign 0 or 1 clicks with 90% chance of 0
    };
  }

  // Update tile states every second
  if (frameCount - lastUpdateFrame >= 60) { // 60 frames per second
    for (let key in tileState) {
      let state = tileState[key];
      if (state.clicks % 2 === 0) {
        // Downtime state
        state.downtime--;
        if (state.downtime <= 0) {
          // Switch to lifespan state when downtime reaches 0
          state.clicks++;
          state.lifespan--; // Decrease lifespan by 1
        }
      } else {
        // Lifespan state
        state.lifespan--;
        if (state.lifespan <= 0) {
          // Reset to downtime state when lifespan reaches 0
          state.clicks++;
          state.downtime = Math.floor(random(4, 101)); // Random downtime between 4 and 100
        }
      }
    }
    lastUpdateFrame = frameCount;
  }

  // Get the base color for the tile (starting as black)
  fill(0);

  // Render the tile with final blended color
  noStroke();
  push();
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  let n = tileState[[i, j]].clicks;
  if (n % 2 === 1) {
    // Draw additional graphics in lifespan state
    fill(255, 255, 100, 128);
    ellipse(0, 0, 10, 10);
  }

  pop();
}



function p3_drawSelectedTile(i, j) {
}

function p3_drawAfter() {}

function sinAt(x, freq = 0.3, scale = 4) {
  return Math.sin(x * freq) * scale;
}

