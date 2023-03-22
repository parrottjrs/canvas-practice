const canvas = document.querySelector("canvas");
canvas.width = innerWidth;
canvas.height = innerHeight;
const c = canvas.getContext("2d");

const cork = new Image();
cork.src = "images/cork.jpeg";

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

function Square(x, y, color, title) {
  this.x = x;
  this.y = y;
  this.width = 100;
  this.height = 100;
  this.color = color;

  this.draw = () => {
    c.beginPath();
    c.fillStyle = this.color;
    c.fillRect(this.x, this.y, this.width, this.height);
    c.font = "20px arial";
    c.fillStyle = hex2rgb(this.color);
    c.fillText(title, this.x + this.width / 16, this.y + this.height / 2);
    c.fillText("+", this.x + 3, this.y + 97);
    c.font = "17px arial";
    c.fillText("x", this.x + 87, this.y + 95);
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

const getNotes = () => {
  const maybeNotes = localStorage.getItem("notes");

  if (maybeNotes === null) {
    return [];
  } else {
    return JSON.parse(maybeNotes);
  }
};

let notes = getNotes();

const saveNote = (updatedNote) => {
  const existing = notes.find((note) => note.id == updatedNote.id);

  if (updatedNote.title === "") {
    for (let i = 0; i < updatedNote.content.length; i++) {
      let preview = updatedNote.content;
      updatedNote.title = updatedNote.title + `${preview[i]}`;
    }
    updatedNote.title = `${updatedNote.title}...`;
  }

  if (existing) {
    if (new Date(existing.updated) <= new Date(updatedNote.updated)) {
      existing.title = updatedNote.title;
      existing.content = updatedNote.content;
      existing.color = updatedNote.color;
      existing.updated = updatedNote.updated;
    }
  } else {
    updatedNote.id = Math.floor(Math.random() * 100000);
    notes.unshift(updatedNote);
  }
  localStorage.setItem("notes", JSON.stringify(notes));
};

const hex2rgb = (hex) => {
  const rgb = [
    `0x${hex[1]}${hex[2]}` | 0,
    `0x${hex[3]}${hex[4]}` | 0,
    `0x${hex[5]}${hex[6]}` | 0,
  ];
  if (rgb[0] + rgb[1] + rgb[2] <= 150) {
    return "#ffffff";
  } else {
    return "#000000";
  }
};

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

for (let i = 0; i < notes.length; i++) {
  notes.map = (note) => {};

  let x = Math.floor(Math.random() * innerWidth);
  let y = Math.floor(Math.random() * innerHeight);
  let width = 100;
  let height = 100;
  let color = notes[i].color;
  let title = notes[i].title;

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
      if (distances.distanceX1 < 0 && distances.distanceX2 < 0) {
        x = Math.floor(Math.random() * innerWidth);
      } else if (distances.distanceY1 < 0 && distances.distanceY2 < 0) {
        y = Math.floor(Math.random() * innerHeight);

        j = -1;
      }
    }
  }

  squareArray.push(new Square(x, y, color, title));
}

const animate = () => {
  requestAnimationFrame(animate);

  c.clearRect(0, 0, innerWidth, innerHeight);

  c.drawImage(cork, 0, 0, innerWidth, innerHeight);

  for (let i = 0; i < squareArray.length; i++) {
    squareArray[i].update();
  }
};

animate();
