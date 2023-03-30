const body = document.querySelector("body");

const wrapper = document.createElement("div");
wrapper.setAttribute("id", "wrapper");
body.append(wrapper);

const canvas = document.createElement("canvas");
wrapper.append(canvas);
canvas.width = innerWidth;
canvas.height = innerHeight;
const c = canvas.getContext("2d");
const cork = new Image();
cork.src = "./cork.jpeg";

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
  changePage("home");
};

const deleteNote = (noteToDelete) => {
  notes = notes.filter((note) => note.id != noteToDelete.id);

  localStorage.setItem("notes", JSON.stringify(notes));
  changePage("home");
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

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  animate();
});

//Note Creation and Event Handling
// objects/variables

function Square(x, y, width, height, color, title, content) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
  this.editing = false;

  this.draw = () => {
    if (this.editing) {
      c.beginPath();
      c.fillStyle = this.color;
      c.fillRect(this.x, this.y, this.width, this.height);
      c.strokeRect(this.x, this.y, this.width, this.height);
      c.font = "20px arial";
      c.fillStyle = hex2rgb(this.color);
      c.fillText("-", this.x + 3, this.y + 17);
      c.fillText(title, this.x + this.width / 4, this.y + 25);
      c.fillText(content, this.x + 10, this.y + this.height / 4);
    } else {
      c.beginPath();
      c.fillStyle = this.color;
      c.fillRect(this.x, this.y, this.width, this.height);
      c.strokeRect(this.x, this.y, this.width, this.height);
      c.font = "20px arial";
      c.fillStyle = hex2rgb(this.color);
      c.fillText("+", this.x + 3, this.y + 17);
    }
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

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

let isDraggable = false;
let isResizable = false;

let start = {
  x: undefined,
  y: undefined,
};

let dx = undefined;
let dy = undefined;

// calculates distance between randomly placed squares

const getDistance = (x1, x2, width, y1, y2, height) => {
  const distanceX1 = x2 - (x1 + width);
  const distanceX2 = x1 - (x2 + width);
  const distanceY1 = y2 - (y1 + height);
  const distanceY2 = y1 - (y2 + height);

  return { distanceX1, distanceX2, distanceY1, distanceY2 };
};

// detects mouse activity in square

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

// detects mouse activity on note resize button

const isOnResize = (x, y) => {
  for (let i = 0; i < squareArray.length; i++)
    if (
      x < squareArray[i].x + 14 &&
      x > squareArray[i].x + 4 &&
      y < squareArray[i].y + 15 &&
      y > squareArray[i].y + 5
    ) {
      square = squareArray[i];
      return true;
    }
  return false;
};

// maximizes note

const maximize = () => {
  const quillContainer = document.createElement("div");
  quillContainer.setAttribute("id", "quill-container");
  wrapper.prepend(quillContainer);
  const quillContainer2 = document.createElement("div");
  quillContainer2.setAttribute("id", "quill-container2");
  quillContainer.append(quillContainer2);
  const quill = new Quill(quillContainer2, { theme: "snow" });
  const editor = document.querySelector(".ql-toolbar.ql-snow");
  editor.style.backgroundColor = "#fffa5c";
  editor.style.border = "0";
};

// minimizes note

const minimize = (square) => {
  square.editing = false;
  quillContainer.remove();
  quillContainer2.remove();
  quill;
};

// mouse event handling for note squares

const mouseDown = (event) => {
  event.preventDefault();

  start.x = event.clientX;
  start.y = event.clientY;

  if (isOnResize(start.x, start.y)) {
    isResizable = true;
  }
  if (isInSquare(start.x, start.y)) {
    isDraggable = true;
  }
};

const mouseUp = (event) => {
  if (!isDraggable) {
    return;
  }
  event.preventDefault();
  start.x = event.clientX;
  start.y = event.clientY;

  if (isResizable && isInSquare(start.x, start.y)) {
    if (square.editing) {
      minimize();
    } else maximize();
  }
  isResizable = false;
  isDraggable = false;
};

const mouseOut = (event) => {
  if (!isDraggable) {
    return;
  }
  event.preventDefault();
  isResizable = false;
  isDraggable = false;
};

const mouseMove = (event) => {
  if (!isDraggable || isResizable) {
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

// animate function

const animate = () => {
  const animationID = requestAnimationFrame(animate);

  c.clearRect(0, 0, innerWidth, innerHeight);
  c.drawImage(cork, 0, 0, innerWidth, innerHeight);

  for (let i = 0; i < squareArray.length; i++) {
    squareArray[i].update();
  }
};

// page creation

const pages = {
  home: {
    create() {
      squareArray = [];
      const createButton = new Square(50, 50, 100, 100, "#fffa5c");
      squareArray.push(createButton);

      for (let i = 0; i < notes.length; i++) {
        notes.map = (note) => {};

        let x = Math.floor(Math.random() * innerWidth);
        let y = Math.floor(Math.random() * innerHeight);
        let width = 100;
        let height = 100;
        let color = notes[i].color;
        let title = notes[i].title;
        let content = notes[i].content;

        if (
          x < 0 ||
          x + width > innerWidth ||
          y < 0 ||
          y + height > innerHeight
        ) {
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

        squareArray.push(
          new Square(x, y, width, height, color, title, content)
        );
      }
      animate();
    },
  },
};
pages.home.create();
