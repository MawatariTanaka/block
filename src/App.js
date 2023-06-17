import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameContextProvider } from './contexts/gameContext';
import Header from './Components/Header';
import Home from './Components/Home';
import Game from './Components/Game';
import Level from './Components/Level';

export default function App() {
    return (
        <GameContextProvider>
            <BrowserRouter className="App">
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/level" element={<Level />} />
                    <Route path="/game" element={<Game />} />
                </Routes>
            </BrowserRouter>
        </GameContextProvider>
    );
}
