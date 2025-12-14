import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const TrainerDashboard = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration_days: ''
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/trainer/plans');
      setPlans(response.data);
    } catch (error) {
      toast.error('Error fetching plans');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', price: '', duration_days: '' });
    setEditingPlan(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      price: parseFloat(formData.price),
      duration_days: parseInt(formData.duration_days)
    };

    try {
      if (editingPlan) {
        await api.put(`/trainer/plans/${editingPlan.id}`, data);
        toast.success('Plan updated successfully!');
      } else {
        await api.post('/trainer/plans', data);
        toast.success('Plan created successfully!');
      }
      fetchPlans();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error saving plan');
    }
  };

  const handleEdit = (plan) => {
    setFormData({
      title: plan.title,
      description: plan.description,
      price: plan.price.toString(),
      duration_days: plan.duration_days.toString()
    });
    setEditingPlan(plan);
    setShowForm(true);
  };

  const handleDelete = async (planId) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    try {
      await api.delete(`/trainer/plans/${planId}`);
      toast.success('Plan deleted successfully!');
      fetchPlans();
    } catch (error) {
      toast.error('Error deleting plan');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Trainer Dashboard</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create New Plan'}
        </button>
      </div>

      {showForm && (
        <div className="plan-form-container">
          <h2>{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h2>
          <form onSubmit={handleSubmit} className="plan-form">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows="4"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Duration (days)</label>
                <input
                  type="number"
                  value={formData.duration_days}
                  onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingPlan ? 'Update Plan' : 'Create Plan'}
              </button>
              <button type="button" className="btn btn-outline" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="plans-list">
        <h2>Your Plans</h2>
        {loading ? (
          <p>Loading...</p>
        ) : plans.length > 0 ? (
          <div className="dashboard-plans">
            {plans.map(plan => (
              <div key={plan.id} className="dashboard-plan-card">
                <h3>{plan.title}</h3>
                <p className="plan-description">{plan.description}</p>
                <div className="plan-meta">
                  <span>${plan.price}</span>
                  <span>{plan.duration_days} days</span>
                </div>
                <div className="plan-actions">
                  <button className="btn btn-secondary" onClick={() => handleEdit(plan)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => handleDelete(plan.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't created any plans yet. Click "Create New Plan" to get started!</p>
        )}
      </div>
    </div>
  );
};

export default TrainerDashboard;
