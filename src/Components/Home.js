import React from 'react';
import { useNavigate } from 'react-router-dom';

import { addNewLevel } from '../backend/levelModifier';

export default function Home() {
    const navigate = useNavigate();

    const handleSelectLevel = () => {
        navigate('/level');
    };

    const handleAdd = () => {
        const initGrid = [
            [1, 1, 3],
            [1, 2, 0],
            [4, 0, 0],
        ];
        const targetGrid = [
            [0, 0, 0],
            [0, 1, 1],
            [0, 1, 0],
        ];
        addNewLevel(initGrid, targetGrid, 4);
    };

    return (
        <main className="home">
            <div className="home-game-preview"></div>
            <div className="home-btn-container">
                <button className="home-nav" onClick={handleSelectLevel}>
                    Select Level
                </button>
                <button className="home-nav" onClick={handleAdd}>
                    Add
                </button>
            </div>
        </main>
    );
}
