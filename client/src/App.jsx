import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import TrainerDashboard from './pages/TrainerDashboard';
import PlanDetails from './pages/PlanDetails';
import UserFeed from './pages/UserFeed';
import TrainerProfile from './pages/TrainerProfile';
import TrainersList from './pages/TrainersList';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/plans/:id" element={<PlanDetails />} />
              <Route path="/trainers" element={<TrainersList />} />
              <Route path="/trainers/:id" element={<TrainerProfile />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requiredRole="trainer">
                    <TrainerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/feed" 
                element={
                  <ProtectedRoute>
                    <UserFeed />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
