import { Link } from 'react-router-dom';

const PlanCard = ({ plan, isPurchased = false }) => {
  return (
    <div className="plan-card">
      <h3>{plan.title}</h3>
      <p className="trainer-name">by {plan.trainer?.name || 'Unknown Trainer'}</p>
      <div className="plan-details">
        <span className="price">${plan.price}</span>
        <span className="duration">{plan.duration_days} days</span>
      </div>
      {isPurchased && <span className="purchased-badge">Purchased</span>}
      <Link to={`/plans/${plan.id}`} className="btn btn-secondary">View Details</Link>
    </div>
  );
};

export default PlanCard;
