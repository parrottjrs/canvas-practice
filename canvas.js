const canvas = document.querySelector("#my-canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const c = canvas.getContext("2d");

const mouse = {
  x: undefined,
  y: undefined,
};

const maxRadius = 40;

window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

const click = {
  x: undefined,
  y: undefined,
};

window.addEventListener("click", (event) => {
  click.x = event.x;
  click.y = event.y;
  init();
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

const colorArray = ["#011627", "#FF0022", "#41EAD4", "#B91372"];

const gravity = 1;
const friction = 0.8;

function Circle(x, y, dx, dy, radius) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
  this.minRadius = radius;

  this.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.stroke();
    c.closePath;
  };

  this.update = function () {
    // bouncing balls

    if (this.y + this.radius + this.dy > canvas.height) {
      this.dy = -this.dy * friction;
    } else {
      this.dy += gravity;
    }
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }
    if (this.y + radius === canvas.height) {
      this.dx === 0;
    }
    this.x += this.dx;
    this.y += this.dy;
    this.draw();
  };
}

// moving balls around screen w/edge detection

if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
  this.dx = -this.dx;
}
if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
  this.dy = -this.dy;
}
this.x += this.dx;
this.y += this.dy;
if (
  mouse.x - this.x < 50 &&
  mouse.x - this.x > -50 &&
  mouse.y - this.y < 50 &&
  mouse.y - this.y > -50
) {
  if (this.radius < maxRadius) {
    this.radius += 1;
  }
} else if (this.radius > this.minRadius) {
  this.radius -= 1;
}

let circleArray;

let circle1;
let circle2;
const init = () => {
  circle1 = new Circle(300, 300, 100, "black");
  circle2 = new Circle(undefined, undefined, 30, "red");

  // generate multiple circles

  circleArray = [];
  for (let i = 0; i < 500; i++) {
    var radius = Math.floor(Math.random() * 30);
    var x = Math.random() * (innerWidth - radius * 2) + radius;
    var y = Math.random() * (innerHeight - radius * 2) + radius;
    var dx = (Math.random() - 0.5) * 5;
    var dy = (Math.random() - 0.5) * 5;
    circleArray.push(new Circle(x, y, dx, dy, radius));
  }
};

const animate = () => {
  requestAnimationFrame(animate);

  c.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < circleArray.length; i++) {
    circleArray[i].update();
  }
};

init();
animate();
