// project.js - purpose and description here
// Author: Garrett Blake
// Date: 4/17/2024

/* exported preload, setup, draw, placeTile */

/* global generateGrid drawGrid */

let seed = 0;
let tilesetImage;
let currentGrid = [];
let numRows, numCols;

// Define variables for day/night cycle
let timeOfDay = 0; // Start at midnight
let cycleDuration = 800; // Duration of the day/night cycle in frames
let maxBrightness = 150; // Maximum brightness during the day
let minBrightness = 0; // Minimum brightness during the night

function preload() {
  tilesetImage = loadImage(
    "./img/tilesetP8.png"
  );
}

function reseed() {
  seed = (seed | 0) + 1109;
  randomSeed(seed);
  noiseSeed(seed);
  rectangles = []
  select("#seedReport").html("seed " + seed);
  regenerateGrid();
}

function regenerateGrid() {
  select("#asciiBox").value(gridToString(generateGrid(numCols, numRows)));
  reparseGrid();
}

function reparseGrid() {
  currentGrid = stringToGrid(select("#asciiBox").value());
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}

function setup() {
  numCols = select("#asciiBox").attribute("rows") | 0;
  numRows = select("#asciiBox").attribute("cols") | 0;

  createCanvas(16 * numCols, 16 * numRows).parent("canvas-container");
  select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

  select("#reseedButton").mousePressed(reseed);
  select("#asciiBox").input(reparseGrid);

  reseed();
  overlayColor = color(0, maxBrightness);
}

function draw() {
  randomSeed(seed);

  // Increment time of day
  timeOfDay = (timeOfDay + 1) % cycleDuration;

  // Calculate brightness based on time of day
  let brightness = calculateBrightness();

  // Set the brightness of the overlay rectangle
  overlayColor = color(0, brightness);

  // Update grid with adjusted brightness
  drawGrid(currentGrid);

  // Draw the overlay rectangle
  fill(overlayColor);
  rect(0, 0, width, height);
}

function placeTile(i, j, ti, tj) {
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}


// Function to calculate brightness based on time of day
function calculateBrightness() {
  let brightness;
  if (timeOfDay < cycleDuration / 2) {
    // Daytime
    brightness = map(timeOfDay, 0, cycleDuration / 2, maxBrightness, minBrightness);
  } else {
    // Nighttime
    brightness = map(timeOfDay, cycleDuration / 2, cycleDuration, minBrightness, maxBrightness);
  }
  return brightness;
}