const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const c = canvas.getContext("2d");
const image = new Image();
image.src = "./cork.jpeg";

// variables

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

let isDraggable = false;

let square;

let start = {
  x: undefined,
  y: undefined,
};

let dx = undefined;
let dy = undefined;

// objects

function Square(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = "#fffa5c";

  this.draw = () => {
    c.beginPath();
    c.fillStyle = this.color;
    c.fillRect(this.x, this.y, this.width, this.height);
  };
  this.update = () => {
    if (this.x < 0) {
      this.x = -this.x;
    }
    if (this.x + this.width > innerWidth) {
      this.x = innerWidth - this.width;
    }
    if (this.y < 0) {
      this.y = -this.y;
    }
    if (this.y + this.height > innerHeight) {
      this.y = innerHeight - this.height;
    }
    this.draw();
  };
}

// functions

const getDistance = (x1, x2, width, y1, y2, height) => {
  const distanceX1 = x2 - (x1 + width);
  const distanceX2 = x1 - (x2 + width);
  const distanceY1 = y2 - (y1 + height);
  const distanceY2 = y1 - (y2 + height);

  return { distanceX1, distanceX2, distanceY1, distanceY2 };
};

const isInSquare = (x, y) => {
  for (let i = 0; i < squareArray.length; i++)
    if (
      x < squareArray[i].x + squareArray[i].width &&
      x > squareArray[i].x &&
      y < squareArray[i].y + squareArray[i].height &&
      y > squareArray[i].y
    ) {
      square = squareArray[i];
      return true;
    }
  return false;
};

const mouseDown = (event) => {
  event.preventDefault();

  start.x = event.clientX;
  start.y = event.clientY;

  if (isInSquare(start.x, start.y)) {
    isDraggable = true;
  }
};

const mouseUp = (event) => {
  if (!isDraggable) {
    return;
  }
  event.preventDefault();
  isDraggable = false;
};

const mouseOut = (event) => {
  if (!isDraggable) {
    return;
  }
  event.preventDefault();
  isDraggable = false;
};

const mouseMove = (event) => {
  if (!isDraggable) {
    return;
  } else {
    event.preventDefault();

    mouse.x = event.clientX;
    mouse.y = event.clientY;

    dx = mouse.x - start.x;
    dy = mouse.y - start.y;

    square.x += dx;
    square.y += dy;

    square.update();

    start.x = mouse.x;
    start.y = mouse.y;
  }
};

canvas.onmousedown = mouseDown;
canvas.onmouseup = mouseUp;
canvas.onmouseout = mouseOut;
canvas.onmousemove = mouseMove;

// implementation
let squareArray = [];

for (let i = 0; i < 10; i++) {
  let x = Math.floor(Math.random() * innerWidth);
  let y = Math.floor(Math.random() * innerHeight);
  const width = 50;
  const height = 50;
  if (x < 0 || x + width > innerWidth || y < 0 || y + height > innerHeight) {
    x = Math.floor(Math.random() * innerWidth);
    y = Math.floor(Math.random() * innerHeight);
  }
  if (i !== 0) {
    for (let j = 0; j < squareArray.length; j++) {
      const distances = getDistance(
        x,
        squareArray[j].x,
        width,
        y,
        squareArray[j].y,
        height
      );
      if (distances.distanceX < 0 && distances.distanceX2 < 0) {
        x = Math.floor(Math.random() * innerWidth);
      } else if (distances.distanceY < 0 && distanceY2 < 0) {
        y = Math.floor(Math.random() * innerHeight);

        j = -1;
      }
    }
  }
  squareArray.push(new Square(x, y, width, height));
}

const animate = () => {
  requestAnimationFrame(animate);

  c.clearRect(0, 0, innerWidth, innerHeight);

  c.drawImage(image, 0, 0, innerWidth, innerHeight);

  for (let i = 0; i < squareArray.length; i++) squareArray[i].update();
};

animate();
