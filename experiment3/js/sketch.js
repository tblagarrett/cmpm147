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

// Modify generateGrid function to include the random rectangles
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
  
  // Place the rectangles in the grid
  for (let i = 0; i < rectangles.length; i++) {
    let rect = rectangles[i];
    for (let y = rect.y; y < rect.y + rect.height; y++) {
      for (let x = rect.x; x < rect.x + rect.width; x++) {
        grid[y][x] = ".";
      }
    }
  }
  
  return grid;
}

function drawGrid(grid) {
  background(128);

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == '_') {
        placeTile(i, j, (floor(random(4))), 0);
      }
      if (grid[i][j] == '.') {
        placeTile(i, j, floor(random(1, 5)), floor(random(21, 25)))
      }
    }
  }
}