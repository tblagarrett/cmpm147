/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */


function getInspirations() {
  return [
    {
      name: "The Bigweld Ball", 
      assetUrl: "./img/exp05Bigweld.jpeg",
      shape: "circle"
    },
    {
      name: "Stanced Up", 
      assetUrl: "./img/exp05inspo2.jpg",
      shape: "line"
    },
    {
      name: "JJK Spoiler", 
      assetUrl: "./img/exp05inspo3.jpg",
      shape: "line"
    },
    {
      name: "Cube", 
      assetUrl: "./img/cube.png",
      shape: "triangle"
    },
    {
      name: "Naruto",
      assetUrl: "./img/naruto.png",
      shape: "line"
    },
    {
      name: "Triangle",
      assetUrl: "./img/Triangular_Prism.png",
      shape: "triangle"
    },
  ];
}

function initDesign(inspiration) {
  resizeCanvas(inspiration.image.width / 8, inspiration.image.height / 8);
  
  let design = {
    bg: 128,
    fg: []
  }

  switch (inspiration.shape) {
    case "square":
      for(let i = 0; i < 100; i++) {
        design.fg.push({x: random(width),
                        y: random(height),
                        w: random(width/2),
                        h: random(height/2),
                        fill: random(255)})
      }
    case "triangle":
      for(let i = 0; i < 500; i++) {
        design.fg.push({
          x1: random(width),
          x2: random(width),
          x3: random(width),
          y1: random(height),
          y2: random(height),
          y3: random(height),
          color: random(255)   
        })
      }
      break
    case "line":
      for(let i = 0; i < 1500; i++) {
        let x = random(width)
        let y = random(height)
        
        design.fg.push({x: x,
                        y: y,
                        width: random(width/2),
                        thickness: random(-3,3),
                        color: random(255)})
      }
      break;
    case "circle":
      for(let i = 0; i < 300; i++) {
        design.fg.push({x: random(width),
                        y: random(height),
                        d: random(-1, 1),
                        fill: random(255)})
      }
      break
    default:
      break
  }
  
  return design;
}

function renderDesign(design, inspiration) {
  
  background(design.bg);
  noStroke();

  switch (inspiration.shape) {
    case "square":
      for(let box of design.fg) {
        fill(box.fill, 128);
        rect(box.x, box.y, box.w, box.h);
      }
    case "triangle":
      for (let tri of design.fg) {
        fill(tri.color, 128)
        triangle(tri.x1, tri.y1, tri.x2, tri.y2, tri.x3, tri.y3)
      }
      break
    case "line":
      for (let line of design.fg) {
        //stroke(line.color);
        fill(line.color,128)
        rect(line.x,line.y,line.width,  line.thickness);
      }
      break
    case "circle":
      for(let circle of design.fg) {
        fill(circle.fill, 128);
        ellipse(circle.x, circle.y, circle.d, circle.d);
      }
      break
    default:
      break
  }
}

function mutateDesign(design, inspiration, rate) {
  design.bg = mut(design.bg, 0, 255, rate);

  switch (inspiration.shape) {
    case "square":
      for(let box of design.fg) {
        box.fill = mut(box.fill, 0, 255, rate);
        box.x = mut(box.x, 0, width, rate);
        box.y = mut(box.y, 0, height, rate);
        box.w = mut(box.w, 0, width/2, rate);
        box.h = mut(box.h, 0, height/2, rate);
      }
    case "triangle":
      for (let tri of design.fg) {
        tri.color = mut(tri.color, 0, 255, rate)
        tri.x1 = mut(tri.x1, 1, width-1, rate)
        tri.x2 = mut(tri.x2, 1, width-1, rate)
        tri.x3 = mut(tri.x3, 1, width-1, rate)
        tri.y1 = mut(tri.y1, 1, height-1, rate)
        tri.y2 = mut(tri.y2, 1, height-1, rate)
        tri.y3 = mut(tri.y3, 1, height-1, rate)
      }
      break
    case "line":
      for (let line of design.fg) {
        line.color = mut(line.color, 0, 255, rate)
        line.x = mut(line.x, 0,width , rate)
        line.y = mut(line.y, 0,height , rate)
        line.width = mut(line.width, 0,width/2 , rate)
      }
    case "circle":
      for(let circle of design.fg) {
        circle.fill = mut(circle.fill, 0, 255, rate);
        circle.x = mut(circle.x, 0, width, rate);
        circle.y = mut(circle.y, 0, height, rate);
        circle.d = mut(circle.d, 0, width, rate);
      }
    default:
      break
  }
}


function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}