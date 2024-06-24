import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { AppRoutes } from './types/routes.ts';
import Games from './components/main/Games.tsx';
import Friends from './components/main/Friends.tsx';
import Leaderboard from './components/main/Leaderboard.tsx';
import Settings from './components/main/Settings.tsx';
import Login from './components/authentication/Login.tsx';
import Registration from './components/authentication/Registration.tsx';
import ErrorPage from './components/misc/ErrorPage.tsx';
import RockPaperScissors from './components/main/games/RockPaperScissors.tsx';
import TicTacToe from './components/main/games/TicTacToe.tsx';
import Roullete from './components/main/games/Roullete.tsx';
import { useEffect, useState } from 'react';
import { PlayerModel } from './models/PlayerModel.ts';

function App() {
  const [user, setUser] = useState<PlayerModel | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeUser = () => {
      const data = localStorage.getItem('user');
      if (data) {
        setUser(JSON.parse(data));
      }
      setIsInitialized(true);
    };
    initializeUser();
  }, []);

  const handleLogin = async (userData: PlayerModel) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path={AppRoutes.LOG_IN} element={<Login onLogin={handleLogin} />} />
          <Route path={AppRoutes.SIGN_UP} element={<Registration />} />
          <Route path="*" element={<Navigate to={AppRoutes.LOG_IN} />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to={AppRoutes.GAMES} />} />
        <Route path={AppRoutes.GAMES} element={<Games />} />
        <Route path={AppRoutes.ROCKPAPERSCISSORS} element={<RockPaperScissors />} />
        <Route path={AppRoutes.TICTACTOE} element={<TicTacToe />} />
        <Route path={AppRoutes.ROULLETE} element={<Roullete />} />
        <Route path={AppRoutes.FRIENDS} element={<Friends />} />
        <Route path={AppRoutes.LEADERBOARD} element={<Leaderboard />} />
        <Route path={AppRoutes.SETTINGS} element={<Settings />} />
        <Route path={AppRoutes.LOG_IN} element={<Login onLogin={handleLogin} />} />
        <Route path={AppRoutes.SIGN_UP} element={<Registration />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
