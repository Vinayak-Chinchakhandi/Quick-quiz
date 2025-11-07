import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './Register';
import { Login } from './Login';
import StartScreen from './startscreen';
import QuizScreen from './quizscreen';
import ResultScreen from './resultsscreen';
import ProfileScreen from './ProfileScreen';
import LeaderboardScreen from './LeaderboardScreen';
import CategorySelectScreen from './CategorySelectScreen';

function ProtectedRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem('userEmail');
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/start" element={<ProtectedRoute><StartScreen /></ProtectedRoute>} />
        <Route path="/quiz" element={<ProtectedRoute><QuizScreen /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><ResultScreen /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardScreen /></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute><CategorySelectScreen /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
