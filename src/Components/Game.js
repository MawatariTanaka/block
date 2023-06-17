import { useContext, useEffect } from 'react';
import { GameContext } from '../contexts/gameContext';
import { v4 as uuid } from 'uuid';
import GameNav from './Game/GameNav';
import { playSound } from './common';

export default function Game() {
    const { state, dispatch } = useContext(GameContext);
    const {
        initialGrid,
        grid,
        listColor,
        currentPiece,
        gridRendered,
        mousePosition,
        allowedMovement,
        finished,
    } = state;
    const [height, width] = [grid.length, grid[0].length];
    const unit = `min(${height <= 4 && width <= 4 ? 20 : 15}vh, ${
        height <= 4 && width <= 4 ? 20 : 15
    }vw)`;

    const gameGridStyle = {
        gridTemplateColumns: `repeat(${width}, ${unit})`,
        gridTemplateRows: `repeat(${height}, ${unit})`,
    };
    const animationTimeUnit = 0.2;

    const changePiece = (value) => {
        // const pieces = document.querySelectorAll(".game-cell");
        // pieces.forEach((piece) => {
        //   const pieceValue = parseInt(piece.getAttribute("piecevalue"));
        //   piece.style.transition = `background-color ${animationTimeUnit}s ease-out`;
        //   if (pieceValue === value) {
        //     piece.style.backgroundColor = pieceValue === 1 ? "red" : "white";
        //   } else {
        //     piece.style.backgroundColor = "";
        //   }
        // });

        dispatch({ type: 'UPDATE_CURRENT_PIECE', payload: value });
    };

    const moveCurrentPiece = (dx, dy, currentGrid) => {
        const newGrid = currentGrid.map((row) => [...row]);
        const oldCell = [];
        const changedCell = [];
        const height = currentGrid.length;
        const width = currentGrid[0].length;
        let canChange = true;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const value = newGrid[y][x];
                if (value !== currentPiece) {
                    continue;
                }
                const newX = x + dx;
                const newY = y + dy;
                if (
                    newX < 0 ||
                    newX >= width ||
                    newY < 0 ||
                    newY >= height ||
                    (newGrid[newY][newX] !== 0 &&
                        newGrid[newY][newX] !== currentPiece)
                ) {
                    canChange = false;
                    break;
                }
                oldCell.push([y, x]);
                changedCell.push([newY, newX]);
            }
            if (!canChange) {
                break;
            }
        }

        if (canChange) {
            playSound(
                `${process.env.PUBLIC_URL}/sounds/block-movement-sound.mp3`
            );
            for (let [y, x] of oldCell) {
                newGrid[y][x] = 0;
            }
            for (let [y, x] of changedCell) {
                newGrid[y][x] = currentPiece;
            }
            const pieces = document.querySelectorAll('.game-cell');
            pieces.forEach((piece) => {
                if (
                    parseInt(piece.getAttribute('piecevalue')) === currentPiece
                ) {
                    piece.style.transition = `transform ${animationTimeUnit}s ease-out`;
                    piece.style.transform = `translate(${dx * 100}%, ${
                        dy * 100
                    }%)`;
                }
            });
        }
        setTimeout(() => {
            dispatch({ type: 'UPDATE_GRID', payload: newGrid });
        }, animationTimeUnit * 1000);
    };

    const gridElements = [];

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const value = grid[y][x];
            const topBorder =
                y === 0 || grid[y - 1][x] !== value
                    ? value === 1
                        ? '3px solid red'
                        : `3px solid ${listColor[value]}`
                    : '';
            const bottomBorder =
                y === height - 1 || grid[y + 1][x] !== value
                    ? value === 1
                        ? '3px solid red'
                        : `3px solid ${listColor[value]}`
                    : '';
            const leftBorder =
                x === 0 || grid[y][x - 1] !== value
                    ? value === 1
                        ? '3px solid red'
                        : `3px solid ${listColor[value]}`
                    : '';
            const rightBorder =
                x === width - 1 || grid[y][x + 1] !== value
                    ? value === 1
                        ? '3px solid red'
                        : `3px solid ${listColor[value]}`
                    : '';
            const backgroundColor =
                value === currentPiece
                    ? value === 1
                        ? 'red'
                        : `${listColor[value]}`
                    : '';

            if (!value) {
                continue;
            }

            gridElements.push(
                <div
                    key={uuid()}
                    piecevalue={value}
                    className={`game-cell ${
                        gridRendered ? '' : 'game-cell-animation'
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
                        if (value !== currentPiece && gridRendered) {
                            changePiece(value);
                        }
                    }}
                ></div>
            );
        }
    }

    const gridTargetElement = [];

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            gridTargetElement.push(
                <div
                    key={uuid()}
                    className="game-cell"
                    style={{
                        gridColumn: `${x + 1}`,
                        gridRow: `${y + 1}`,
                        backgroundColor: `${
                            state.targetGrid[y][x] ? 'red' : ''
                        }`,
                    }}
                ></div>
            );
        }
    }

    useEffect(() => {
        // setTimeout(() => {
        //     dispatch({ type: 'UPDATE_GRID', payload: initialGrid });
        // }, 1000);
        dispatch({ type: 'UPDATE_GRID', payload: initialGrid });
    }, []);

    return (
        <main
            className="game"
            onMouseDown={(event) => {
                const clickedElement = event.target;
                const pieceValue = clickedElement.getAttribute('piecevalue');
                if (parseInt(pieceValue) !== currentPiece && pieceValue) {
                    return;
                }
                dispatch({
                    type: 'UPDATE_MOUSE_POSITION',
                    payload: { x: event.clientX, y: event.clientY },
                });
            }}
            onMouseUp={(event) => {
                let dx = event.clientX - mousePosition.x;
                let dy = event.clientY - mousePosition.y;
                if (
                    (Math.abs(dx) > 10 || Math.abs(dy) > 10) &&
                    allowedMovement &&
                    !finished
                ) {
                    if (Math.abs(dx) > Math.abs(dy)) {
                        moveCurrentPiece(Math.sign(dx), 0, grid);
                    } else {
                        moveCurrentPiece(0, Math.sign(dy), grid);
                    }
                }
            }}
        >
            <div className="game-grid" style={gameGridStyle}>
                <div className="game-target-grid" style={gameGridStyle}>
                    {gridTargetElement}
                </div>
                {gridElements}
            </div>
            <GameNav />
        </main>
    );
}
