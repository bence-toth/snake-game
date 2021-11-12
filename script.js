const boardNode = document.getElementById("board");

const dimensions = 31;
const board = Array(dimensions).fill(Array(dimensions).fill(null));

let snakeCells = [
  [Math.round(dimensions / 2) - 1, Math.round(dimensions / 2) - 1],
  [Math.round(dimensions / 2) - 1, Math.round(dimensions / 2)],
  [Math.round(dimensions / 2) - 1, Math.round(dimensions / 2) + 1],
];

let snakeDirection = "top";
let nextSnakeDirection = "top";

const boardHtml = board
  .map(
    (row, rowIndex) => `
    <div>
      ${row
        .map(
          (column, columnIndex) => `
          <div class="cell void" data-row="${rowIndex}" data-column="${columnIndex}"></div>
        `
        )
        .join("")}
    </div>`
  )
  .join("");

boardNode.innerHTML = boardHtml;

const updateBoard = () => {
  board.forEach((row, rowIndex) => {
    row.forEach((column, columnIndex) => {
      const cell = boardNode.querySelector(
        `[data-row="${rowIndex}"][data-column="${columnIndex}"]`
      );
      if (snakeCells.find(([x, y]) => x === columnIndex && y === rowIndex)) {
        cell.classList.add("snake");
        cell.classList.remove("void");
      } else {
        cell.classList.add("void");
        cell.classList.remove("snake");
      }
    });
  });
};

updateBoard();

const moveSnake = () => {
  snakeDirection = nextSnakeDirection;
  const [headX, headY] = snakeCells[0];
  if (snakeDirection === "top") {
    snakeCells = [[headX, headY - 1], ...snakeCells.slice(0, -1)];
  }
  if (snakeDirection === "right") {
    snakeCells = [[headX + 1, headY], ...snakeCells.slice(0, -1)];
  }
  if (snakeDirection === "bottom") {
    snakeCells = [[headX, headY + 1], ...snakeCells.slice(0, -1)];
  }
  if (snakeDirection === "left") {
    snakeCells = [[headX - 1, headY], ...snakeCells.slice(0, -1)];
  }
};

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      if (snakeDirection !== "bottom") {
        nextSnakeDirection = "top";
      }
      break;
    case "ArrowDown":
      if (snakeDirection !== "top") {
        nextSnakeDirection = "bottom";
      }
      break;
    case "ArrowLeft":
      if (snakeDirection !== "right") {
        nextSnakeDirection = "left";
      }
      break;
    case "ArrowRight":
      if (snakeDirection !== "left") {
        nextSnakeDirection = "right";
      }
      break;
  }
});

setInterval(() => {
  moveSnake();
  updateBoard();
}, 100);
