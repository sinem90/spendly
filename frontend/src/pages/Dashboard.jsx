import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { transactionService } from '../services/transactionService';
import { budgetService } from '../services/budgetService';
import PageHeader from '../components/PageHeader';

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
    <div style={{ padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <PageHeader
          title="Dashboard"
          subtitle="Overview of your financial health"
        />

      <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--gray-600)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Expenses</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
            ${stats?.totalExpenses?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--gray-600)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Categories</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>
            {stats?.categoriesCount || 0}
          </p>
        </div>
      </div>

      <div className="card fade-in" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ color: 'var(--gray-900)' }}>Budget Status</h2>
          <Link to="/budgets" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>View All →</Link>
        </div>
        {budgetStatus.length === 0 ? (
          <p style={{ color: 'var(--gray-600)' }}>No active budgets. <Link to="/budgets" style={{ color: 'var(--primary)' }}>Create one</Link></p>
        ) : (
          <div>
            {budgetStatus.map((budget) => (
              <div key={budget.budget_id} style={{ padding: '1rem', borderBottom: '1px solid var(--gray-200)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '500', color: 'var(--gray-900)' }}>{budget.category_name}</span>
                  <span style={{ color: 'var(--gray-700)' }}>${budget.spent_amount} / ${budget.budget_amount}</span>
                </div>
                <div style={{ backgroundColor: 'var(--gray-200)', height: '8px', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min(budget.percentage_used, 100)}%`,
                    height: '100%',
                    backgroundColor: budget.percentage_used > 90 ? 'var(--danger)' : budget.percentage_used > 75 ? 'var(--warning)' : 'var(--success)',
                    transition: 'width 0.3s'
                  }} />
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginTop: '0.25rem' }}>
                  {budget.percentage_used}% used
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card fade-in" style={{ padding: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>Spending by Category</h2>
        {stats?.byCategory?.length === 0 ? (
          <p style={{ color: 'var(--gray-600)' }}>No transactions yet. <Link to="/transactions" style={{ color: 'var(--primary)' }}>Add one</Link></p>
        ) : (
          <div>
            {stats?.byCategory?.map((cat) => (
              <div key={cat.category_id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--gray-200)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: cat.color }} />
                  <span style={{ color: 'var(--gray-900)' }}>{cat.category_name}</span>
                </div>
                <span style={{ fontWeight: '500', color: 'var(--gray-900)' }}>${parseFloat(cat.total_amount).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
