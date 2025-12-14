import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PlanCard from '../components/PlanCard';
import toast from 'react-hot-toast';

const TrainerProfile = () => {
  const { id } = useParams();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchTrainer();
  }, [id]);

  const fetchTrainer = async () => {
    try {
      const response = await api.get(`/trainers/${id}`);
      setTrainer(response.data);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error fetching trainer profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      toast.error('Please login to follow trainers');
      return;
    }

    setActionLoading(true);
    try {
      await api.post(`/trainers/${id}/follow`);
      toast.success('Now following this trainer!');
      fetchTrainer();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error following trainer');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setActionLoading(true);
    try {
      await api.delete(`/trainers/${id}/unfollow`);
      toast.success('Unfollowed trainer');
      fetchTrainer();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error unfollowing trainer');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!trainer) {
    return <div className="error">Trainer not found</div>;
  }

  const isOwnProfile = user && user.id === trainer.id;
  const canFollow = user && user.role === 'user' && !isOwnProfile;

  return (
    <div className="trainer-profile">
      <div className="profile-header">
        <div className="profile-avatar">{trainer.name.charAt(0).toUpperCase()}</div>
        <div className="profile-info">
          <h1>{trainer.name}</h1>
          <p className="followers-count">{trainer.followers_count} followers</p>
        </div>
        {canFollow && (
          <div className="profile-actions">
            {trainer.is_following ? (
              <button className="btn btn-outline" onClick={handleUnfollow} disabled={actionLoading}>
                {actionLoading ? 'Processing...' : 'Unfollow'}
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleFollow} disabled={actionLoading}>
                {actionLoading ? 'Processing...' : 'Follow'}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="trainer-plans">
        <h2>Fitness Plans by {trainer.name}</h2>
        {trainer.plans && trainer.plans.length > 0 ? (
          <div className="plans-grid">
            {trainer.plans.map(plan => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        ) : (
          <p>This trainer hasn't created any plans yet.</p>
        )}
      </div>
    </div>
  );
};

export default TrainerProfile;
