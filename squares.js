const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const c = canvas.getContext("2d");

// variables

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

let isDraggable = false;

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

  this.draw = () => {
    c.beginPath();
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

const mouseInSquare = (x, y, square) => {
  if (
    x < square.x + square.width &&
    x > square.x &&
    y < square.y + square.height &&
    y > square.y
  ) {
    return true;
  }
  return false;
};

const mouseDown = (event) => {
  event.preventDefault();

  start.x = event.clientX;
  start.y = event.clientY;

  if (mouseInSquare(start.x, start.y, square1)) {
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

    square1.x += dx;
    square1.y += dy;

    square1.update();

    start.x = mouse.x;
    start.y = mouse.y;
  }
};

canvas.onmousedown = mouseDown;
canvas.onmouseup = mouseUp;
canvas.onmouseout = mouseOut;
canvas.onmousemove = mouseMove;

// implementation
let square1;
square1 = new Square(250, 150, 150, 150);

const animate = () => {
  requestAnimationFrame(animate);

  c.clearRect(0, 0, innerWidth, innerHeight);

  square1.update();
};

animate();
