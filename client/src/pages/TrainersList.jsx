import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const TrainersList = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await api.get('/trainers');
      setTrainers(response.data);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error fetching trainers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trainers-page">
      <h1>Our Trainers</h1>
      <p>Browse and follow certified fitness trainers</p>
      
      {loading ? (
        <p>Loading...</p>
      ) : trainers.length > 0 ? (
        <div className="trainers-grid">
          {trainers.map(trainer => (
            <Link to={`/trainers/${trainer.id}`} key={trainer.id} className="trainer-card">
              <div className="trainer-avatar">{trainer.name.charAt(0).toUpperCase()}</div>
              <h3>{trainer.name}</h3>
              <p className="trainer-role">Certified Trainer</p>
            </Link>
          ))}
        </div>
      ) : (
        <p>No trainers available yet.</p>
      )}
    </div>
  );
};

export default TrainersList;
