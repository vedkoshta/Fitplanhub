import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PlanDetails = () => {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchPlan();
  }, [id]);

  const fetchPlan = async () => {
    try {
      const response = await api.get(`/plans/${id}`);
      setPlan(response.data);
    } catch (error) {
      toast.error('Error fetching plan details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Please login to subscribe');
      return;
    }

    setSubscribing(true);
    try {
      await api.post(`/plans/${id}/subscribe`);
      toast.success('Successfully subscribed to plan!');
      fetchPlan();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error subscribing');
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!plan) {
    return <div className="error">Plan not found</div>;
  }

  return (
    <div className="plan-details-page">
      <div className="plan-header">
        <h1>{plan.title}</h1>
        <Link to={`/trainers/${plan.trainer?.id}`} className="trainer-link">
          by {plan.trainer?.name}
        </Link>
      </div>

      <div className="plan-info">
        <div className="plan-meta-large">
          <div className="meta-item">
            <span className="label">Price</span>
            <span className="value">${plan.price}</span>
          </div>
          <div className="meta-item">
            <span className="label">Duration</span>
            <span className="value">{plan.duration_days} days</span>
          </div>
        </div>

        {plan.is_subscribed ? (
          <div className="plan-content">
            <div className="subscribed-badge">You have access to this plan</div>
            <h2>Plan Description</h2>
            <div className="description">{plan.description}</div>
          </div>
        ) : (
          <div className="plan-preview">
            <div className="locked-content">
              <h2>Subscribe to Access Full Plan</h2>
              <p>Get complete access to this fitness plan including detailed workouts, nutrition guides, and more.</p>
              {user ? (
                <button 
                  className="btn btn-primary btn-large" 
                  onClick={handleSubscribe}
                  disabled={subscribing}
                >
                  {subscribing ? 'Processing...' : `Subscribe for $${plan.price}`}
                </button>
              ) : (
                <Link to="/login" className="btn btn-primary btn-large">
                  Login to Subscribe
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanDetails;
