import { useContext } from "react";
import { GameContext } from "../../contexts/gameContext";
import { v4 as uuid } from "uuid";

export default function GameGrid() {
  const { state, dispatch } = useContext(GameContext);
  const grid = state.grid.map((row) => [...row]);
  console.log(grid);
  const [height, width] = [grid.length, grid[0].length];
  const unit = `min(20vh, 20vw)`;
  const animationTimeUnit = 0.3;

  function changePiece(value) {
    const pieces = document.querySelectorAll(".game-cell");
    pieces.forEach((piece) => {
      const pieceValue = parseInt(piece.getAttribute("piecevalue"));
      piece.style.transition = `background-color ${animationTimeUnit}s ease-out`;
      if (pieceValue === value) {
        piece.style.backgroundColor = pieceValue === 1 ? "red" : "white";
      } else {
        piece.style.backgroundColor = "";
      }
    });
    setTimeout(() => {
      dispatch({ type: "UPDATE_CURRENT_PIECE", payload: value });
    }, animationTimeUnit * 1000);
  }

  const gridElements = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const value = grid[y][x];
      const topBorder =
        y === 0 || grid[y - 1][x] !== value
          ? value === 1
            ? "3px solid red"
            : "3px solid white"
          : "";
      const bottomBorder =
        y === height - 1 || grid[y + 1][x] !== value
          ? value === 1
            ? "3px solid red"
            : "3px solid white"
          : "";
      const leftBorder =
        x === 0 || grid[y][x - 1] !== value
          ? value === 1
            ? "3px solid red"
            : "3px solid white"
          : "";
      const rightBorder =
        x === width - 1 || grid[y][x + 1] !== value
          ? value === 1
            ? "3px solid red"
            : "3px solid white"
          : "";
      const backgroundColor =
        value === state.currentPiece ? (value === 1 ? "red" : "white") : "";

      if (!value) {
        continue;
      }

      gridElements.push(
        <div
          key={uuid()}
          piecevalue={value}
          className={`game-cell ${
            state.gridRendered ? "" : "game-cell-animation"
          }`}
          style={{
            gridColumn: `${x + 1}`,
            gridRow: `${y + 1}`,
            backgroundColor: backgroundColor,
            borderTop: topBorder,
            borderBottom: bottomBorder,
            borderLeft: leftBorder,
            borderRight: rightBorder,
          }}
          onMouseDown={() => {
            if (value !== state.currentPiece && state.gridRendered) {
              changePiece(value);
            }
          }}
        ></div>
      );
    }
  }

  return (
    <div
      className="game-grid"
      style={{
        gridTemplateColumns: `repeat(${grid[0].length}, ${unit})`,
        gridTemplateRows: `repeat(${grid.length}, ${unit})`,
      }}
    >
      <div className="game-target-grid"></div>
      {gridElements}
    </div>
  );
}
