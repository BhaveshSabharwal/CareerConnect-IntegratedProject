import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Explorer from './pages/Explorer';
import Jobs from './pages/Jobs';
import Resume from './pages/Resume';
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
            element={<Dashboard />} 
          />
          <Route path="explorer" element={<Explorer />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="resume" element={<Resume />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
