import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { transactionService } from '../services/transactionService';
import { budgetService } from '../services/budgetService';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [budgetStatus, setBudgetStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, budgetData] = await Promise.all([
        transactionService.getStats(),
        budgetService.getStatus()
      ]);
      setStats(statsData);
      setBudgetStatus(budgetData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '0.5rem', color: '#666' }}>Total Expenses</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
            ${stats?.totalExpenses?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginBottom: '0.5rem', color: '#666' }}>Categories</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
            {stats?.categoriesCount || 0}
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Budget Status</h2>
          <Link to="/budgets" style={{ color: '#2563eb', textDecoration: 'none' }}>View All</Link>
        </div>
        {budgetStatus.length === 0 ? (
          <p style={{ color: '#666' }}>No active budgets. <Link to="/budgets">Create one</Link></p>
        ) : (
          <div>
            {budgetStatus.map((budget) => (
              <div key={budget.budget_id} style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '500' }}>{budget.category_name}</span>
                  <span>${budget.spent_amount} / ${budget.budget_amount}</span>
                </div>
                <div style={{ backgroundColor: '#f0f0f0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(budget.percentage_used, 100)}%`,
                    height: '100%',
                    backgroundColor: budget.percentage_used > 90 ? '#ef4444' : budget.percentage_used > 75 ? '#f59e0b' : '#10b981',
                    transition: 'width 0.3s'
                  }} />
                </div>
                <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
                  {budget.percentage_used}% used
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '1rem' }}>Spending by Category</h2>
        {stats?.byCategory?.length === 0 ? (
          <p style={{ color: '#666' }}>No transactions yet. <Link to="/transactions">Add one</Link></p>
        ) : (
          <div>
            {stats?.byCategory?.map((cat) => (
              <div key={cat.category_id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #eee' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: cat.color }} />
                  <span>{cat.category_name}</span>
                </div>
                <span style={{ fontWeight: '500' }}>${parseFloat(cat.total_amount).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
