// sketch.js - purpose and description here
// Author: Garrett Blake
// Date: 4/14/2024


// Globals
let canvasContainer;
var centerHorz, centerVert;
let seed = 1;

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}

function draw() {
  background(220); // Clear the canvas
  
  // Draw the first box on the left half of the screen
  let boxWidth = width / 2;
  let boxHeight = height;
  
  //      FIRST BOX
  fill("#cad29f");
  strokeWeight(10); // Set the thickness of the outer stroke
  stroke("#eee8c4");
  rect(0, 0, boxWidth + 1, boxHeight + 1); // slightly larger to create overlap


  //      SECOND BOX
  // Draw the second box on the top half of the screen
  fill("#efcf84");
  strokeWeight(10); // Set the thickness of the outer stroke
  stroke("#eee8c4");
  rect(boxWidth - 1, 0, boxWidth + 2, height / 2 + 1); // slightly larger to create overlap
  

  //      THIRD BOX
  fill("#f28c63");
  strokeWeight(10); // Set the thickness of the outer stroke
  stroke("#eee8c4");
  rect(boxWidth - 1, height / 2 - 1, boxWidth + 2, height / 2 + 1); // slightly larger to create overlap


  // PUT SCENES IN BOXES
  // Set the seed for noise
  noiseSeed(seed);

  // FIRST BOX SCENE
  drawFirstBoxMountain(boxWidth, boxHeight);
  drawFirstBoxBush(boxWidth, boxHeight)
  drawFirstBoxGrass(boxWidth, boxHeight)


  // Draw the inner border of the first box
  noFill(); // No fill for the inner border
  strokeWeight(1); // Set the thickness of the inner stroke
  stroke("#0f0503"); // Black color for the inner stroke
  rect(5, 5, boxWidth - 12, boxHeight - 10); // Adjusted position and size to create inner border

  noFill(); // No fill for the inner border
  strokeWeight(1); // Set the thickness of the inner stroke
  stroke("#0f0503"); // Black color for the inner stroke
  rect(5 + boxWidth - 1, 5, boxWidth - 8, (height / 2) - 12); // Adjusted position and size to create inner border

  noFill(); // No fill for the inner border
  strokeWeight(1); // Set the thickness of the inner stroke
  stroke("#0f0503"); // Black color for the inner stroke
  rect(5 + boxWidth - 1, height / 2 + 5, boxWidth - 9, (height / 2) - 10); // Adjusted position and size to create inner border
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
  // code to run when mouse is pressed
}

function drawFirstBoxMountain(boxWidth, boxHeight) {
  // Determine the height of the mountain line
  let mountainHeight = height / 4;
  let mountainScalar = 250;

  // Set the seed for the first layer of noise
  noiseSeed(seed);
  randomSeed(seed);

  // Draw the mountain line using Perlin noise
  beginShape();
  fill("#957f6e");
  stroke("#644f48"); // Black color for the line
  strokeWeight(1); // Set the thickness of the line

  vertex(5, height * 3 / 4); // bottom left of the mountain shape

  for (let x = 5; x < boxWidth - 6; x++) {
    // Calculate the y-coordinate of the point using multiple layers of Perlin noise
    let y = (noise(x * 0.008, seed) + (noise(x * 2, seed + random())) * .03) * mountainScalar / 2;

    // Ensure the line stays within the height of the box
    y = constrain(y, 0, mountainScalar);
    y += mountainHeight;

    // Draw the vertex
    vertex(x, y);
  }

  vertex(boxWidth - 7, height * 3 / 4); // bottom right of the mountain shape
  vertex(5, height * 3 / 4); // bottom left of the mountain shape

  endShape();
}


function drawFirstBoxBush(boxWidth, boxHeight) {
  // Determine the height of the bush line
  let bushHeight = height * 3.7/8;
  let bushScalar = 100;

  noiseSeed(seed + 1); // Using seed + 1 to ensure it's different from the mountain noise seed

  // Draw the bush line using Perlin noise
  beginShape();
  fill("#a09462");
  noStroke(); // No stroke for the bush line

  vertex(5, height); // bottom left of the bush shape

  for (let x = 5; x < boxWidth - 6; x++) {
    // Calculate the y-coordinate of the point using Perlin noise
    let y = (noise(x * 0.008) * bushScalar);
    
    // Ensure the line stays within the height of the box
    y = constrain(y, 0, bushScalar);
    y += bushHeight;
    
    // Draw the vertex
    vertex(x, y);
  }

  vertex(boxWidth - 7, height * 3/4); // bottom right of the bush shape
  vertex(5, height * 3/4); // bottom left of the bush shape

  endShape();
}

function drawFirstBoxGrass(boxWidth, boxHeight) {
  // Determine the height of the grass line
  let grassHeight = height * 5/8;
  let grassScalar = 40;

  noiseSeed(seed + 2); // Using seed + 2 to ensure it's different from the mountain and bush noise seed

  // Draw the grass line using Perlin noise
  beginShape();
  fill("#bbb362");
  noStroke(); // No stroke for the grass line

  vertex(5, height); // bottom left of the grass shape

  for (let x = 5; x < boxWidth - 6; x++) {
    // Calculate the y-coordinate of the point using Perlin noise
    let y = (noise(x * 0.003) * grassScalar);
    
    // Ensure the line stays within the height of the box
    y = constrain(y, 0, grassScalar);
    y += grassHeight;
    
    // Draw the vertex
    vertex(x, y);
  }

  vertex(boxWidth - 7, height - 6); // bottom right of the grass shape
  vertex(5, height - 6); // bottom left of the grass shape

  endShape();
}
