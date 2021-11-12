const boardNode = document.getElementById("board");
const boardDimensions = 51;

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
        .map((_, columnIndex) => {
          if (
            snakeCells.find(([x, y]) => x === columnIndex && y === rowIndex)
          ) {
            return `<div class="cell snake" data-row="${rowIndex}" data-column="${columnIndex}"></div>`;
          } else {
            return `<div class="cell void" data-row="${rowIndex}" data-column="${columnIndex}"></div>`;
          }
        })
        .join("")}
    </div>`
    )
    .join("");
  boardNode.innerHTML = boardHtml;
};

const createFood = () => {
  const voidCells = boardNode.querySelectorAll(".void");
  const randomVoidCell =
    voidCells[Math.floor((voidCells.length - 1) * Math.random())];
  randomVoidCell.classList.add("food");
  randomVoidCell.classList.remove("void");
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
  if (
    nextCell[0] < 0 ||
    nextCell[0] >= boardDimensions ||
    nextCell[1] < 0 ||
    nextCell[1] >= boardDimensions ||
    snakeCells.find(([x, y]) => x === nextCell[0] && y === nextCell[1])
  ) {
    // Game over
    clearInterval(gameClock);
    document.getElementById("gameOver").classList.remove("hidden");
    document.getElementById("restart").tabIndex = 0;
    document.getElementById("restart").focus();
    document.getElementById("restart").addEventListener("click", () => {
      window.location.reload();
    });
  } else if (nextCell[0] === food[0] && nextCell[1] === food[1]) {
    // Eat
    const foodNode = boardNode.querySelector(".cell.food");
    foodNode.classList.add("snake");
    foodNode.classList.remove("food");
    snakeCells = [nextCell, ...snakeCells];
    createFood();
  } else {
    // Move snake
    const newCell = document.querySelector(
      `.cell[data-column="${nextCell[0]}"][data-row="${nextCell[1]}"]`
    );
    newCell.classList.add("snake");
    newCell.classList.remove("void");
    const [tailX, tailY] = snakeCells[snakeCells.length - 1];
    const clearCell = document.querySelector(
      `.cell[data-column="${tailX}"][data-row="${tailY}"]`
    );
    clearCell.classList.remove("snake");
    clearCell.classList.add("void");
    snakeCells = [nextCell, ...snakeCells.slice(0, -1)];
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
  createFood();
  document.addEventListener("keydown", registerSnakeDirectionChange);
  gameClock = setInterval(() => {
    moveSnake();
  }, 50);
};

init();
