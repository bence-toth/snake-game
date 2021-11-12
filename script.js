const boardNode = document.getElementById("board");
const boardDimensions = 31;

const board = Array(boardDimensions).fill(Array(boardDimensions).fill(null));

let snakeCells = [
  [Math.round(boardDimensions / 2) - 1, Math.round(boardDimensions / 2) - 1],
  [Math.round(boardDimensions / 2) - 1, Math.round(boardDimensions / 2)],
  [Math.round(boardDimensions / 2) - 1, Math.round(boardDimensions / 2) + 1],
];

let snakeDirection = "top";
let nextSnakeDirection = "top";

const renderBoard = () => {
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
};

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

const registerSnakeDirectionChange = (event) => {
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
};

const init = () => {
  renderBoard();
  document.addEventListener("keydown", registerSnakeDirectionChange);
  updateBoard();
  setInterval(() => {
    moveSnake();
    updateBoard();
  }, 100);
};

init();
