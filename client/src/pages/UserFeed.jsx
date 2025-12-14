import { useState, useEffect } from 'react';
import api from '../services/api';
import PlanCard from '../components/PlanCard';
import toast from 'react-hot-toast';

const UserFeed = () => {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const response = await api.get('/users/me/feed');
      setFeedItems(response.data);
    } catch (error) {
      toast.error('Error fetching feed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-feed">
      <h1>Your Feed</h1>
      <p className="feed-description">Plans from trainers you follow and plans you've purchased</p>
      
      {loading ? (
        <p>Loading...</p>
      ) : feedItems.length > 0 ? (
        <div className="plans-grid">
          {feedItems.map(item => (
            <PlanCard 
              key={item.plan.id} 
              plan={item.plan} 
              isPurchased={item.is_purchased}
            />
          ))}
        </div>
      ) : (
        <div className="empty-feed">
          <h2>Your feed is empty</h2>
          <p>Start following trainers to see their plans here!</p>
        </div>
      )}
    </div>
  );
};

export default UserFeed;
