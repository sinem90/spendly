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
        <h1 style={{ color: 'var(--gray-900)' }}>Budgets</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: showForm ? 'var(--gray-600)' : 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          {showForm ? 'Cancel' : '+ Add Budget'}
        </button>
      </div>

      {showForm && (
        <div className="card fade-in" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>New Budget</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--gray-700)' }}>Category</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius)' }}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--gray-700)' }}>Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius)' }}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--gray-700)' }}>Start Date</label>
                <input
                  type="date"
                  value={formData.periodStart}
                  onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--gray-700)' }}>End Date</label>
                <input
                  type="date"
                  value={formData.periodEnd}
                  onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius)' }}
                />
              </div>
            </div>
            <button
              type="submit"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--success)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Add Budget
            </button>
          </form>
        </div>
      )}

      <div className="card fade-in">
        {budgets.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-600)' }}>No active budgets</p>
        ) : (
          budgets.map(budget => (
            <div key={budget.budget_id} style={{ padding: '1.5rem', borderBottom: '1px solid var(--gray-200)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: budget.color }} />
                    <h3 style={{ margin: 0, color: 'var(--gray-900)' }}>{budget.category_name}</h3>
                  </div>
                  <p style={{ margin: 0, color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                    {format(new Date(budget.period_start), 'MMM d')} - {format(new Date(budget.period_end), 'MMM d, yyyy')}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(budget.budget_id)}
                  style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: 'var(--danger)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Delete
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '500', color: 'var(--gray-900)' }}>
                  ${parseFloat(budget.spent_amount).toFixed(2)} / ${parseFloat(budget.budget_amount).toFixed(2)}
                </span>
                <span style={{ color: parseFloat(budget.percentage_used) > 90 ? 'var(--danger)' : 'var(--gray-600)' }}>
                  {budget.percentage_used}% used
                </span>
              </div>
              <div style={{ backgroundColor: 'var(--gray-200)', height: '12px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.min(parseFloat(budget.percentage_used), 100)}%`,
                  height: '100%',
                  backgroundColor: parseFloat(budget.percentage_used) > 90 ? 'var(--danger)' : parseFloat(budget.percentage_used) > 75 ? 'var(--warning)' : 'var(--success)',
                  transition: 'width 0.3s'
                }} />
              </div>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: 'var(--gray-600)' }}>
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
