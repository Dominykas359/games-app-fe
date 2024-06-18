import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css'
import { AppRoutes } from './types/routes.ts';
import Games from './components/main/Games.tsx';
import Friends from './components/main/Friends.tsx';
import Leaderboard from './components/main/Leaderboard.tsx';
import Settings from './components/main/Settings.tsx';
import Login from './components/authentication/Login.tsx';
import Registration from './components/authentication/Registration.tsx';
import ErrorPage from './components/misc/ErrorPage.tsx';

function App() {

  
  return(
    <BrowserRouter>
      <Routes>
        <Route 
          index 
          element = {(<Navigate to={AppRoutes.GAMES} />)}
        />
        <Route
          path={AppRoutes.GAMES}
          element={(<Games />)}
        />
        <Route
          path={AppRoutes.FRIENDS}
          element={(<Friends />)}
        />
        <Route
          path={AppRoutes.LEADERBOARD}
          element={(<Leaderboard />)}
        />
        <Route
          path={AppRoutes.SETTINGS}
          element={(<Settings />)}
        />
        <Route
          path={AppRoutes.LOG_IN}
          element={(<Login />)}
        />
        <Route
          path={AppRoutes.SIGN_UP}
          element={(<Registration />)}
        />
        <Route
          path='*'
          element={(<ErrorPage />)}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
