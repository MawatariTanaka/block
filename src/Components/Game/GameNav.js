import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { GameContext } from '../../contexts/gameContext';
import { playSound } from '../common';

export default function GameNav() {
    const { state, dispatch } = useContext(GameContext);
    const initialGrid = state.initialGrid.map((row) => [...row]);
    return (
        <div className="game-menu-container">
            <div
                className="game-menu-btn"
                style={{
                    gridColumn: '1 / span 2',
                    marginBottom: '1rem',
                    borderRadius: '1.2rem',
                    justifyContent: 'flex-start',
                }}
            >
                Number of moves made: {state.moveCounter}.
            </div>
            <div
                className="game-menu-btn"
                onMouseDown={() => {
                    playSound(
                        `${process.env.PUBLIC_URL}/sounds/block-movement-sound.mp3`
                    );
                    dispatch({ type: 'UPDATE_GRID', payload: initialGrid });
                }}
            >
                Restart
            </div>
            <Link className="game-menu-btn" to="/">
                Menu
            </Link>
            {state.finished && (
                <div
                    className="game-menu-btn congratulation"
                    style={{ gridColumn: '1 / span 2' }}
                >
                    Congratulation
                </div>
            )}
        </div>
    );
}
