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
let food = [null, null];

let gameClock;

const renderBoard = () => {
  const boardHtml = board
    .map(
      (row, rowIndex) => `
    <div>
      ${row
        .map(
          (column, columnIndex) => `
          <div class="cell" data-row="${rowIndex}" data-column="${columnIndex}"></div>
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
        cell.classList.remove("food");
      } else if (food[0] === columnIndex && food[1] === rowIndex) {
        cell.classList.add("food");
        cell.classList.remove("void");
        cell.classList.remove("snake");
      } else {
        cell.classList.add("void");
        cell.classList.remove("snake");
        cell.classList.remove("food");
      }
    });
  });
};

const createFood = () => {
  const voidCells = boardNode.querySelectorAll(".void");
  const randomVoidCell =
    voidCells[Math.floor((voidCells.length - 1) * Math.random())];
  food = [
    Number(randomVoidCell.dataset.column),
    Number(randomVoidCell.dataset.row),
  ];
};

const moveSnake = () => {
  snakeDirection = nextSnakeDirection;
  const [headX, headY] = snakeCells[0];
  let nextCell;
  if (snakeDirection === "top") {
    nextCell = [headX, headY - 1];
  }
  if (snakeDirection === "right") {
    nextCell = [headX + 1, headY];
  }
  if (snakeDirection === "bottom") {
    nextCell = [headX, headY + 1];
  }
  if (snakeDirection === "left") {
    nextCell = [headX - 1, headY];
  }
  if (nextCell[0] === food[0] && nextCell[1] === food[1]) {
    snakeCells = [nextCell, ...snakeCells];
    const foodNode = boardNode.querySelector(".cell.food");
    foodNode.classList.add("snake");
    foodNode.classList.remove("food");
    createFood();
  } else if (
    nextCell[0] < 0 ||
    nextCell[0] >= boardDimensions ||
    nextCell[1] < 0 ||
    nextCell[1] >= boardDimensions ||
    snakeCells.find(([x, y]) => x === nextCell[0] && y === nextCell[1])
  ) {
    clearInterval(gameClock);
  } else {
    snakeCells = [nextCell, ...snakeCells.slice(0, -1)];
  }
  updateBoard();
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
  createFood();
  updateBoard();
  gameClock = setInterval(() => {
    moveSnake();
  }, 50);
};

init();
