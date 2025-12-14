import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PlanCard from '../components/PlanCard';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing">
      <section className="hero">
        <h1>Transform Your Fitness Journey</h1>
        <p>Connect with certified trainers and access personalized fitness plans</p>
        {!user && (
          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-primary">Get Started</Link>
            <Link to="/login" className="btn btn-outline">Login</Link>
          </div>
        )}
      </section>

      <section className="plans-section">
        <h2>Featured Fitness Plans</h2>
        {loading ? (
          <p>Loading plans...</p>
        ) : plans.length > 0 ? (
          <div className="plans-grid">
            {plans.map(plan => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        ) : (
          <p>No plans available yet. Check back soon!</p>
        )}
      </section>
    </div>
  );
};

export default Landing;
