const canvas = document.querySelector("canvas");
const secondsCount = document.querySelector(".seconds");
const level = document.querySelector(".grade");
const context = canvas.getContext("2d");
const pugDimensions = { width: 353 * 1.2, height: 325 * 1.2 };

const levels = {
  5: "Sr Assistant",
  10: "Jr Honoror",
  15: "Master Honoror",
  35: "S Tier Honoror",
  65: "Junior Acolyte",
  105: "Acolyte",
  150: "Senior Acolyte",
  250: "Priest",
  450: "Sage",
  650: "Hermit",
  1000: "Senior Hermit",
  1500: "CEO",
  2500: "Pope",
  3500: "Underlord",
  4500: "Lord",
  10500: "OverLord",
  20500: "King",
  30500: "Anunnaki"
};

const startTime = Date.now();

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
context.translate(window.innerWidth / 2, window.innerHeight / 2);

const image = new Image();
image.src = "./assets/pug.png";

const loopingPugs = 40; // Number of pugs in animation
const offsetDistance = 120;
let currentOffset = 0;

const movementRange = 200;

const mouseOffset = {
  x: 0,
  y: 0
};

const movementOffset = {
  x: 0,
  y: 0
};

image.onload = () => {
  adjustCanvasZoom();
  startLooping();
};

window.onresize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context.setTransform(1, 0, 0, 1, 0, 0); // Reset the canvas context
  context.translate(window.innerWidth / 2, window.innerHeight / 2);
  adjustCanvasZoom();
};

// Adjust zoom level dynamically based on screen size
function adjustCanvasZoom() {
  if (window.innerWidth <= 768) {
    context.scale(0.75, 0.75); // Zoom out for smaller screens
  } else {
    context.setTransform(1, 0, 0, 1, 0, 0); // Reset scaling
    context.translate(window.innerWidth / 2, window.innerHeight / 2);
  }
}

// Handle mouse and touch inputs
function onMouseMove(e) {
  const isTouch = e.touches && e.touches.length > 0;
  const clientX = isTouch ? e.touches[0].clientX : e.clientX;
  const clientY = isTouch ? e.touches[0].clientY : e.clientY;

  mouseOffset.x = (clientX - window.innerWidth / 2) / window.innerWidth / 2 * movementRange;
  mouseOffset.y = (clientY - window.innerHeight / 2) / window.innerHeight / 2 * movementRange;
}

// Add event listeners for mouse and touch inputs
canvas.addEventListener("mousemove", onMouseMove);
canvas.addEventListener("touchmove", onMouseMove);

function lerp(start, end, amount) {
  return start * (1 - amount) + end * amount;
}

function draw(offset, loopCount) {
  let currentPercentage = (loopingPugs - loopCount) / loopingPugs;
  context.drawImage(
    image,
    -pugDimensions.width / 2 - offset / 2 + (movementOffset.x * currentPercentage),
    -pugDimensions.height / 2 - offset / 2 + (movementOffset.y * currentPercentage),
    pugDimensions.width + offset,
    pugDimensions.height + offset
  );
}

function loopDraw() {
  movementOffset.x = lerp(movementOffset.x, mouseOffset.x, 0.05);
  movementOffset.y = lerp(movementOffset.y, mouseOffset.y, 0.05);

  for (let i = loopingPugs; i >= 1; i--) {
    draw(i * offsetDistance + currentOffset, i);
  }

  draw(offsetDistance, 1);

  currentOffset++;
  if (currentOffset >= offsetDistance) {
    currentOffset = 0;
  }

  const newTime = Math.floor((Date.now() - startTime) / 1000);

  secondsCount.innerText = newTime;

  if (levels[newTime]) {
    level.innerText = levels[newTime];
  }

  requestAnimationFrame(loopDraw);
}

function startLooping() {
  requestAnimationFrame(loopDraw);
}
