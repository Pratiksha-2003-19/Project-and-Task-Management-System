import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Team from './pages/Team';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  // Debugging: check if auth is flickering
  console.log('App Rendering - Authenticated:', isAuthenticated);

  return (
    <div className="app-container">
      {isAuthenticated && <Sidebar />}
      <main className={isAuthenticated ? 'main-content' : 'auth-content'}>
        {isAuthenticated && <Navbar />}
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" />} />

          {/* Protected Routes */}
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/projects" element={isAuthenticated ? <Projects /> : <Navigate to="/login" />} />
          <Route path="/tasks" element={isAuthenticated ? <Tasks /> : <Navigate to="/login" />} />
          <Route path="/team" element={isAuthenticated ? <Team /> : <Navigate to="/login" />} />

          {/* Settings route completely removed */}

          {/* Catch-all: Redirect to home or login */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;