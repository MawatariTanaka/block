import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../contexts/gameContext';
import { collection, query, where, getDocs } from '@firebase/firestore';
import { db, convertObjectToNestedArray } from '../contexts/firebaseContext';

export default function Level() {
    const navigate = useNavigate();
    const { dispatch } = useContext(GameContext);
    const handlePlay = async (level) => {
        const q = query(collection(db, 'grid'), where('level', '==', level));
        const querySnapshot = await getDocs(q);
        const result = querySnapshot.docs[0].data();
        const { initGrid, targetGrid } = result;
        dispatch({
            type: 'SET_GRID',
            payload: {
                initGrid: convertObjectToNestedArray(initGrid),
                targetGrid: convertObjectToNestedArray(targetGrid),
            },
        });
        navigate('/game');
    };

    const [numberOfLevels, setNumberOfLevels] = useState(0);

    useEffect(() => {
        async function fetchData() {
            const querySnapshot = await getDocs(collection(db, 'grid'));
            const data = querySnapshot.docs.map((doc) => doc.data());
            setNumberOfLevels(data.length);
        }

        fetchData();
    }, []);

    const levelArray = [];
    for (let i = 1; i <= numberOfLevels; i++) {
        levelArray.push(
            <button
                key={i}
                className="level"
                onClick={() => {
                    handlePlay(i);
                }}
            >
                {i}
            </button>
        );
    }
    return (
        <>
            <div className="level-container">{levelArray}</div>
        </>
    );
}
