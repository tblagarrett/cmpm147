// sketch.js
// Author: Garrett Blake
// Date: 4/17/2024

houses = []
let cloudOffset = 0;

function generateGrid(numCols, numRows) {
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      let value = noiseAt(i, j)
      switch (true) {
        case value < 0.35:
          row.push("w")
          break
        case value > 0.55:
          row.push("-")
          break
        default:
          row.push("H")
      }
    }
    grid.push(row);
  }

  createHouses(grid, floor(random(0, 5)))

  return grid;
}

function drawGrid(grid) {
  background(128);

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if (gridCheck(grid, i, j, "-")){            // TREES
        placeTile(i, j, floor(random(4)), 12);
        drawContext(grid, i, j, "-", 22, 1, treeLookup)
      } else if (gridCheck(grid, i, j, "H")) {    // PLAINS
        placeTile(i, j, weightedRandom(1, 4) - 1, 12);
      } else if (gridCheck(grid, i, j, "w")) {    // WATER
        placeTile(i, j, tileFromNoiseTime(i, j), 14);
        drawContext(grid, i, j, "w", 10, 13, waterLookup)
      }
    }
  }

  for (let i = 0; i < houses.length; i++) {
    placeTile(houses[i].yPos, houses[i].xPos, floor(random(26, 28)), floor(random(4)))
  }
}

function drawCloudShadows() {
  // Set the alpha value for the cloud shadows
  let alpha = 100; // Adjust this value to control the opacity of the shadows
  
  // Set up variables for noise generation
  let t = millis() * 0.0001; // Time variable for noise
  let xOffset = random(-1, 1); // Initial x-offset for the noise
  let yOffset = random(-1, 1); // Initial y-offset for the noise
  let noiseScale = 0.004; // Adjust this value to control the scale of the noise
  
  // Loop through the entire screen to draw cloud shadows
  for (let y = 0; y < height; y += 20) {
    for (let x = 0; x < width; x += 20) {
      // Calculate noise value
      let noiseValue = noise(xOffset * t + x * noiseScale, yOffset * t + y * noiseScale);
      if (noiseValue < .55) {
        continue
      }
      
      // Map noise value to alpha value
      let shadowAlpha = map(noiseValue, 0, 1, 0, alpha);
      
      // Set fill color with alpha
      fill(0, shadowAlpha);
      noStroke();
      
      // Draw a semi-transparent rectangle
      rect(x, y, 20, 20);
    }
  }
}


function createHouses(grid, count) {
  houses = []
  for (let i = 0; i < count; i++) {
    for (let attempts = 0; attempts < 10; attempts++) {
      let xPos = floor(random(1, grid[0].length - 1))
      let yPos = floor(random(1, grid.length - 1))

      if (gridCheck(grid, yPos, xPos, "H")) {
        houses.push({xPos: xPos, yPos: yPos})
      }
    }
  }
}

function noiseAt(y, x, layers=1, zoom=.02) {
  let value = 0;
  for (let i = 1; i <= layers; i++) {
    let power = Math.pow(i, 2)
    value += 1/(power) * noise(power * y * zoom, power * x * zoom)
  }
  return value
}

function tileFromNoiseTime(y, x, layers=3, zoom=0.02) {
  let value = 0;
  for (let i = 1; i <= layers; i++) {
    let power = Math.pow(i, 2)
    value += 1/(power) * noise(power * y* zoom, power * x * zoom, millis()*0.0001)
  }
  
  switch (true) {
    case value < .5:
      return 0
    case value < .65:
      return 3
    case value < .9:
      return 2
    default:
      return 1
  }
}

// https://stackoverflow.com/questions/8435183/generate-a-weighted-random-number
function weightedRandom(min, max) {
  return Math.round(max / (random() * max + min));
}


function gridCheck(grid, i, j, target) {
  if (i >= 0 && i < grid.length && j >= 0 && j < grid[0].length) {
    return grid[i][j] === target;
  }
  return false;
}

function gridCode(grid, i, j, target) {
  let code = 0;
  if (!gridCheck(grid, i + 1, j, target) && !gridCheck(grid, i + 1, j, "X")) code += 1; // South bit
  if (!gridCheck(grid, i - 1, j, target) && !gridCheck(grid, i - 1, j, "X")) code += 2; // North bit
  if (!gridCheck(grid, i, j - 1, target) && !gridCheck(grid, i, j - 1, "X")) code += 4; // West bit
  if (!gridCheck(grid, i, j + 1, target) && !gridCheck(grid, i, j + 1, "X")) code += 8; // East bit
  return code;
}

function drawContext(grid, i, j, target, dti, dtj, lookup) {
  const code = gridCode(grid, i, j, target);
  const offset = lookup[code];
  if (offset) {
    placeTile(i, j, dti + offset[0], dtj + offset[1]);
  }
}

// East, West, North, South
const treeLookup = [
  [0, 0], // 0000: No adjacent target tile
  [0, 1], // 0001: Only South tile
  [0, -1], // 0010: Only North tile
  [-2, -1], // 0011: North and south tiles
  [-1, 0], // 0100: Only west tile
  [-1, 1], // 0101: West and south tiles
  [-1, -1], // 0110: West and north tiles
  [-2, -1], // 0111: North, south, and west tiles
  [1, 0], // 1000: Only east tile
  [1, 1], // 1001: East and south tiles
  [1, -1], // 1010: East and north tiles
  [1, -1], // 1011: North, south, and east tiles
  [-1, -2], // 1100: East and west tiles
  [0, 1], // 1101: South, east, and west tiles
  [-2, -1], // 1110: North, east, and west tiles
  [-1, -2], // 1111: All adjacent target tiles
];

const waterLookup = [
  [0, 0], // 0000: No adjacent target tile
  [0, 1], // 0001: Only South tile
  [0, -1], // 0010: Only North tile
  [-2, -1], // 0011: North and south tiles
  [-1, 0], // 0100: Only west tile
  [-1, 1], // 0101: West and south tiles
  [-1, -1], // 0110: West and north tiles
  [-2, -1], // 0111: North, south, and west tiles
  [1, 0], // 1000: Only east tile
  [1, 1], // 1001: East and south tiles
  [1, -1], // 1010: East and north tiles
  [1, -1], // 1011: North, south, and east tiles
  [-1, -2], // 1100: East and west tiles
  [0, 1], // 1101: South, east, and west tiles
  [-2, -1], // 1110: North, east, and west tiles
  [-1, -2], // 1111: All adjacent target tiles
];
