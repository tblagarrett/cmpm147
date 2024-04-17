// sketch.js
// Author: Garrett Blake
// Date: 4/17/2024

/* exported preload, setup, draw, placeTile */

/* global generateGrid drawGrid */

// sketch.js

let rectangles = []; // Array to store the coordinates of each rectangle

// Function to generate a random rectangle within the grid and store its coordinates
function generateRectangle(grid) {
  let rectWidth = floor(random(3, grid[0].length / 2)); // Random width for the rectangle
  let rectHeight = floor(random(3, grid.length / 2)); // Random height for the rectangle
  let startX = floor(random(0, grid[0].length - rectWidth)); // Random starting X position
  let startY = floor(random(0, grid.length - rectHeight)); // Random starting Y position
  
  // Store the coordinates of the rectangle
  rectangles.push({ x: startX, y: startY, width: rectWidth, height: rectHeight });
}

// Function to generate multiple rectangles, ensuring they are at least 2 spaces away from each other
function generateRectangles(grid, count) {
  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let success = false;
    while (attempts < 10 && !success) {
      generateRectangle(grid);
      success = true;
      // Check if the newly generated rectangle collides with any existing rectangle
      for (let j = 0; j < rectangles.length - 1; j++) {
        let currentRect = rectangles[rectangles.length - 1];
        let existingRect = rectangles[j];
        if (currentRect.x < existingRect.x + existingRect.width + 2 &&
            currentRect.x + currentRect.width + 2 > existingRect.x &&
            currentRect.y < existingRect.y + existingRect.height + 2 &&
            currentRect.y + currentRect.height + 2 > existingRect.y) {
          // Collision detected, generate a new rectangle
          success = false;
          rectangles.pop(); // Remove the last generated rectangle
          attempts++;
          break;
        }
      }
    }
  }
}

// Modify generateGrid function to include the random rectangles and draw hallways between nearby pairs
function generateGrid(numCols, numRows) {
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }
  
  // Add multiple random rectangles
  generateRectangles(grid, floor(random(2, 11))); // Generate 2 to 10 rectangles
  
  // Draw hallways between nearby pairs of rectangles
  drawHallways(grid, rectangles);
  
  // Place the rectangles in the grid
  for (let i = 0; i < rectangles.length; i++) {
    let rect = rectangles[i];
    for (let y = rect.y; y < rect.y + rect.height; y++) {
      for (let x = rect.x; x < rect.x + rect.width; x++) {
        grid[y][x] = ".";
      }
    }
  }

  placeChestInRoom(grid)
  
  return grid;
}

function placeChestInRoom(grid) {
  // Choose a random rectangle
  let randomRect = rectangles[floor(random(rectangles.length))];
  
  // Calculate the top half of the rectangle's height
  let topHalfHeight = floor(randomRect.height / 2);
  
  // Randomly select a position in the top half of the rectangle
  let posX = randomRect.x + floor(random(1, randomRect.width - 1)); // Random X position within the rectangle
  let posY = randomRect.y + floor(random(topHalfHeight)); // Random Y position in the top half of the rectangle
  
  // Place the tile at the selected position
  grid[posY][posX] = "X";
}




// Function to draw hallways between nearby pairs of rectangles
function drawHallways(grid, rectangles) {
  for (let i = 0; i < rectangles.length; i++) {
    for (let j = i + 1; j < rectangles.length; j++) {
      let rect1 = rectangles[i];
      let rect2 = rectangles[j];
      
      // Find the center of each rectangle
      let center1 = { x: rect1.x + Math.floor(rect1.width / 2), y: rect1.y + Math.floor(rect1.height / 2) };
      let center2 = { x: rect2.x + Math.floor(rect2.width / 2), y: rect2.y + Math.floor(rect2.height / 2) };
      
      // Draw a straight line between the centers in cardinal directions
      if (center1.x === center2.x) {
        for (let y = Math.min(center1.y, center2.y); y <= Math.max(center1.y, center2.y); y++) {
          grid[y][center1.x] = ".";
        }
      } else if (center1.y === center2.y) {
        for (let x = Math.min(center1.x, center2.x); x <= Math.max(center1.x, center2.x); x++) {
          grid[center1.y][x] = ".";
        }
      }
    }
  }
}



function drawGrid(grid) {
  background(128);

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if (gridCheck(grid, i, j, ".")) {
        placeTile(i, j, floor(random(1, 5)), floor(random(21, 24)))
        drawContext(grid, i, j, ".", 4, 21);
      } else {
        placeTile(i, j, floor(random(4)), 15);
      }

      if (gridCheck(grid, i, j, "X")) {
        placeTile(i, j, floor(random(3, 6)), floor(random(28, 31)))
      }
    }
  }
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

function drawContext(grid, i, j, target, dti, dtj) {
  const code = gridCode(grid, i, j, target);
  const offset = lookup[code];
  if (offset && code != 0) {
    placeTile(i, j, dti + offset[0] + 20, dtj + offset[1]);
  }
}

// East, West, North, South

const lookup = [
  [0, 0], // 0000: No adjacent target tile
  [2, 2], // 0001: Only South tile
  [2, 0], // 0010: Only North tile
  [2, 0], // 0011: North and south tiles
  [1, 1], // 0100: Only west tile
  [1, 2], // 0101: West and south tiles
  [1, 0], // 0110: West and north tiles
  [1, 0], // 0111: North, south, and west tiles
  [3, 1], // 1000: Only east tile
  [3, 2], // 1001: East and south tiles
  [3, 0], // 1010: East and north tiles
  [3, 0], // 1011: North, south, and east tiles
  [1, 1], // 1100: East and west tiles
  [1, 2], // 1101: South, east, and west tiles
  [1, 0], // 1110: North, east, and west tiles
  [1, 0], // 1111: All adjacent target tiles
];

