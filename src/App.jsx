import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import InterviewerDashboard from './pages/InterviewerDashboard';
import Explorer from './pages/Explorer';
import Jobs from './pages/Jobs';
import Resume from './pages/Resume';
import Auth from './pages/Auth';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route 
            index 
            element={user ? <Navigate to="/dashboard" replace /> : <Home />} 
          />
          <Route 
            path="dashboard" 
            element={
              !user ? <Navigate to="/" replace /> :
              user.role === 'ADMIN' ? <AdminDashboard /> :
              user.role === 'INTERVIEWER' ? <InterviewerDashboard /> :
              <Dashboard />
            } 
          />
          <Route path="explorer" element={user ? <Explorer /> : <Navigate to="/" replace />} />
          <Route path="jobs" element={user ? <Jobs /> : <Navigate to="/" replace />} />
          <Route path="resume" element={user ? <Resume /> : <Navigate to="/" replace />} />
          <Route path="auth" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
