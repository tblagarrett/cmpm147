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

const waves = [];
const wavePropagationSpeed = .02;
const dissipationRate = 0.001;
const maxWaveDistance = 100;
const maxWaveDuration = 5 * 1000;
let color1, color2;


function p3_preload() {}

function p3_setup() {
  // Generate random colors
  color1 = color(random(255), random(255), random(255));
  color2 = color(random(255), random(255), random(255));
}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  color1 = color(random(255), random(255), random(255));
  color2 = color(random(255), random(255), random(255));
  waves.splice(0, waves.length)
}

function p3_tileWidth() {
  return 16;
}

function p3_tileHeight() {
  return 8;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_drawBefore() {
  background(0);
}

function p3_tileClicked(i, j) {
  // Record the time of the click
  const clickTime = millis();

  // Add a new wave for the click
  waves.push({ position: { i, j }, startTime: clickTime });
}

function p3_drawTile(i, j, offsetX, offsetY) {
  // Calculate the wave effect for each tile
  let waveEffect = 0;
  if (waves.length > 0) {
    for (const wave of waves) {
      const { position, startTime } = wave;
      const distance = dist(position.i, position.j, i, j);
      const timeWithPropagation = (millis() - startTime) * wavePropagationSpeed;
      const timeElapsed = millis() - startTime;

      // Gradually increase the wave effect over time and within the maximum distance
      if (timeWithPropagation > distance && distance < maxWaveDistance) {
        const waveAmplitude = sinAt(distance - timeWithPropagation) * 7; // Calculate the wave amplitude
        waveEffect += waveAmplitude;
      }

      // Remove waves that have exceeded the maximum duration
      if (timeElapsed > maxWaveDuration) {
        const index = waves.indexOf(wave);
        if (index !== -1) {
          waves.splice(index, 1);
        }
        continue; // Skip further processing for this wave
      }

      // Gradually dissipate the wave effect over time for each wave individually
      waveEffect *= exp(-dissipationRate * (millis() - startTime));
    }
  }

  // Calculate tile height based on wave effect
  const tileHeight = waveEffect * 0.5; // Adjust the multiplier as needed
  
  // Interpolate between two random colors based on tile height
  const blendedColor = lerpColor(color1, color2, constrain(map(tileHeight, -th, th, 0, 1), 0, 1));
  
  // Get the base color for the tile
  let baseColor;
  if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
    baseColor = color(240, 200);
  } else {
    baseColor = color(255, 200);
  }
  
  // Blend the base color with the interpolated color based on tile height
  const finalColor = lerpColor(baseColor, blendedColor, constrain(map(abs(tileHeight), 0, th, 0, 1), 0, 1));

  // Render the tile with final blended color
  noStroke();
  fill(finalColor);
  push();
  translate(0, waveEffect); // Apply the displacement
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  pop();
}

function p3_drawSelectedTile(i, j) {
}

function p3_drawAfter() {}

function sinAt(x, freq = 0.3, scale = 4) {
  return Math.sin(x * freq) * scale;
}

