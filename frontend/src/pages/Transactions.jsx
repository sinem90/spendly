import { useState, useEffect } from 'react';
import { transactionService } from '../services/transactionService';
import { categoryService } from '../services/categoryService';
import { format } from 'date-fns';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    description: '',
    transactionDate: format(new Date(), 'yyyy-MM-dd'),
    type: 'expense'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [txData, catData] = await Promise.all([
        transactionService.getAll(),
        categoryService.getAll()
      ]);
      setTransactions(txData.transactions || []);
      setCategories(catData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await transactionService.create(formData);
      setShowForm(false);
      setFormData({
        categoryId: '',
        amount: '',
        description: '',
        transactionDate: format(new Date(), 'yyyy-MM-dd'),
        type: 'expense'
      });
      loadData();
    } catch (error) {
      alert('Error creating transaction: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this transaction?')) {
      try {
        await transactionService.delete(id);
        loadData();
      } catch (error) {
        alert('Error deleting transaction');
      }
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--gray-900)' }}>Transactions</h1>
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
          {showForm ? 'Cancel' : '+ Add Transaction'}
        </button>
      </div>

      {showForm && (
        <div className="card fade-in" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>New Transaction</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--gray-700)' }}>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius)' }}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--gray-700)' }}>Category</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius)' }}
                >
                  <option value="">Select category</option>
                  {categories.filter(c => c.type === formData.type).map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
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
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--gray-700)' }}>Date</label>
                <input
                  type="date"
                  value={formData.transactionDate}
                  onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius)' }}
                />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--gray-700)' }}>Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius)' }}
              />
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
              Add Transaction
            </button>
          </form>
        </div>
      )}

      <div className="card fade-in" style={{ overflow: 'hidden' }}>
        {transactions.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-600)' }}>No transactions yet</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: 'var(--gray-50)' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--gray-700)' }}>Date</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--gray-700)' }}>Category</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: 'var(--gray-700)' }}>Description</th>
                <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: 'var(--gray-700)' }}>Amount</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: 'var(--gray-700)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.transaction_id} style={{ borderBottom: '1px solid var(--gray-200)' }}>
                  <td style={{ padding: '1rem', color: 'var(--gray-900)' }}>{format(new Date(tx.transaction_date), 'MMM d, yyyy')}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: tx.category_color }} />
                      <span style={{ color: 'var(--gray-900)' }}>{tx.category_name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--gray-600)' }}>{tx.description || '-'}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '500', color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)' }}>
                    {tx.type === 'income' ? '+' : '-'}${parseFloat(tx.amount).toFixed(2)}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button
                      onClick={() => handleDelete(tx.transaction_id)}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Transactions;
