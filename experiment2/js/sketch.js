// sketch.js - purpose and description here
// Author: Garrett Blake
// Helped by ChatGPT
// Date: 4/14/2024


// Globals
let canvasContainer;
var centerHorz, centerVert;
let seed = 1;
let thirdSquareColor = "#cad29f"

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

// listener for reimagine button
$("#reimagine").click(function() {
  seed *= random(2, 10);
  sunAngle = random(0, 2 * Math.PI); // Initialize sun angle
});

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
  fill(thirdSquareColor);
  strokeWeight(10); // Set the thickness of the outer stroke
  stroke("#eee8c4");
  rect(boxWidth - 1, height / 2 - 1, boxWidth + 2, height / 2 + 1); // slightly larger to create overlap


  // PUT SCENES IN BOXES
  // Set the seed for noise
  noiseSeed(seed);

  // FIRST BOX SCENE
  drawFirstBoxMountain(boxWidth, boxHeight);
  drawFirstBoxBush(boxWidth, boxHeight);
  drawFirstBoxGrass(boxWidth, boxHeight);

  // SECOND BOX SCENE
  drawSecondBoxTree(boxWidth, boxHeight);

  // THIRD BOX SCENE
  drawThirdBoxSun(boxWidth, boxHeight);
  drawThirdBoxMountain(boxWidth, boxHeight);

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
  stroke("#4c3829")

  vertex(5, height); // bottom left of the bush shape

  for (let x = 5; x < boxWidth - 7; x++) {
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
  stroke("#4c3829")

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

let swayAngle = 0; // Initialize sway angle

function drawSecondBoxTree(boxWidth, boxHeight) {
  // Define trunk parameters
  let trunkWidth = 30;
  let trunkHeight = boxHeight / 4;
  let trunkX = boxWidth + boxWidth/2 - 10;
  let trunkY = height - 7 - boxHeight * 3/4;

  // Draw trunk
  fill("#c2a16c"); // Brown color for trunk
  stroke("#4c3829");
  rect(trunkX, trunkY, trunkWidth, trunkHeight);

  // Update sway angle
  swayAngle += 0.02; // Adjust the sway speed as needed

  // Define leaf parameters
  let leafColor = "#bfbf63";

  // Draw leaves (triangles) with sway effect
  let swayOffset = sin(swayAngle) * 5; // Adjust sway amplitude as needed
  let swayOffset2 = sin(swayAngle + Math.PI/8) * 5; // Adjust sway amplitude as needed

  // Draw random vertical lines on the trunk
  strokeWeight(1); // Set the thickness of the lines
  stroke("#4c3829"); // Brown color for the lines

  // Generate random number of lines (between 1 and 10)
  let numLines = floor(random(1, 11));
  for (let i = 0; i < numLines; i++) {
    // Randomly choose x-coordinate along the trunk
    let x = random(trunkX, trunkX + trunkWidth);
    // Randomly choose y-coordinate within the trunk height
    let y1 = trunkY + random(trunkHeight);
    let y2 = y1 + random(-30, 10); // Add some randomness to the line length
    line(x, y1, x, y2); // Draw the vertical line
  }

  // Draw leaves (triangles)
  fill(leafColor);
  stroke("#4c3829");
  triangle(trunkX - 50, trunkY + 50 + swayOffset, 
           trunkX + trunkWidth / 2, trunkY - 30 + swayOffset,
           trunkX + 50 + trunkWidth, trunkY + 50 + swayOffset);

  triangle(trunkX - 50, trunkY + 20 + swayOffset2, 
           trunkX + trunkWidth / 2, trunkY - 50 + swayOffset2,
           trunkX + 50 + trunkWidth, trunkY + 20 + swayOffset2);
}

let sunAngle = 0

function drawThirdBoxSun(boxWidth, boxHeight) {
  // Define circle parameters
  let circleRadius = min(boxWidth, boxHeight / 2) / 2 - 20; // Radius of the circle
  let circleCenterX = boxWidth + boxWidth / 2; // X-coordinate of the circle center
  let circleCenterY = height - boxHeight / 4; // Y-coordinate of the circle center

  // Calculate current position of the sun on the circumference of the circle
  let sunX = circleCenterX + cos(sunAngle) * circleRadius;
  let sunY = circleCenterY + sin(sunAngle) * circleRadius;

  // Update sun angle for next frame (simulate movement)
  sunAngle += 0.01; // Adjust the speed of sun movement as needed

  // Determine the position of the sun relative to its lowest and highest points
  let sunPosition = map(sunY, circleCenterY - circleRadius, circleCenterY + circleRadius, 0, 1);

  // Interpolate between the two background colors based on sun position
  thirdSquareColor = lerpColor(color("#cad29f"), color("#f28c63"), sunPosition);

  // Draw the sun
  fill("#cec597"); // Yellow color for the sun
  stroke("#160b0c"); // Black color for the stroke
  strokeWeight(1); // Set the thickness of the stroke
  ellipse(sunX, sunY, 30, 30); // Draw the sun as a circle
}


function drawThirdBoxMountain(boxWidth, boxHeight) {
  // Determine the height of the mountain line
  let mountainHeight = height * 5/8;
  let mountainScalar = 300;

  // Set the seed for the first layer of noise
  noiseSeed(seed + 4);
  randomSeed(seed + 4);

  // Draw the mountain line using Perlin noise
  beginShape();
  fill("#957f6e");
  stroke("#644f48"); // Black color for the line
  strokeWeight(1); // Set the thickness of the line

  vertex(width/2 + 5, height - 7); // bottom left of the mountain shape

  for (let x = width/2 + 5; x < width - 6; x++) {
    // Calculate the y-coordinate of the point using multiple layers of Perlin noise
    let y = (noise(x * 0.005, seed) + (noise(x * 2, seed + random())) * .03) * mountainScalar / 2;

    // Ensure the line stays within the height of the box
    y = constrain(y, 0, mountainScalar);
    y += mountainHeight;

    // Draw the vertex
    vertex(x, y);
  }

  vertex(width - 5, height - 6); // bottom right of the mountain shape
  vertex(width/2 + 5, height - 6); // bottom left of the mountain shape

  endShape();
}