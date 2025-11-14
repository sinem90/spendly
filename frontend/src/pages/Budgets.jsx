import { useState, useEffect } from 'react';
import { budgetService } from '../services/budgetService';
import { categoryService } from '../services/categoryService';
import { format, startOfMonth, endOfMonth } from 'date-fns';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    periodStart: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    periodEnd: format(endOfMonth(new Date()), 'yyyy-MM-dd')
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [budgetData, catData] = await Promise.all([
        budgetService.getStatus(),
        categoryService.getAll('expense')
      ]);
      setBudgets(budgetData);
      setCategories(catData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await budgetService.create(formData);
      setShowForm(false);
      setFormData({
        categoryId: '',
        amount: '',
        periodStart: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        periodEnd: format(endOfMonth(new Date()), 'yyyy-MM-dd')
      });
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating budget');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this budget?')) {
      try {
        await budgetService.delete(id);
        loadData();
      } catch (error) {
        alert('Error deleting budget');
      }
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Budgets</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          {showForm ? 'Cancel' : '+ Add Budget'}
        </button>
      </div>

      {showForm && (
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>New Budget</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Category</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Start Date</label>
                <input
                  type="date"
                  value={formData.periodStart}
                  onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>End Date</label>
                <input
                  type="date"
                  value={formData.periodEnd}
                  onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Add Budget
            </button>
          </form>
        </div>
      )}

      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        {budgets.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No active budgets</p>
        ) : (
          budgets.map(budget => (
            <div key={budget.budget_id} style={{ padding: '1.5rem', borderBottom: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: budget.color }} />
                    <h3 style={{ margin: 0 }}>{budget.category_name}</h3>
                  </div>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.875rem' }}>
                    {format(new Date(budget.period_start), 'MMM d')} - {format(new Date(budget.period_end), 'MMM d, yyyy')}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(budget.budget_id)}
                  style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Delete
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '500' }}>
                  ${parseFloat(budget.spent_amount).toFixed(2)} / ${parseFloat(budget.budget_amount).toFixed(2)}
                </span>
                <span style={{ color: parseFloat(budget.percentage_used) > 90 ? '#ef4444' : '#666' }}>
                  {budget.percentage_used}% used
                </span>
              </div>
              <div style={{ backgroundColor: '#f0f0f0', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.min(parseFloat(budget.percentage_used), 100)}%`,
                  height: '100%',
                  backgroundColor: parseFloat(budget.percentage_used) > 90 ? '#ef4444' : parseFloat(budget.percentage_used) > 75 ? '#f59e0b' : '#10b981',
                  transition: 'width 0.3s'
                }} />
              </div>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#666' }}>
                Remaining: ${parseFloat(budget.remaining_amount).toFixed(2)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Budgets;
