import { useState, useEffect } from 'react';
import { categoryService } from '../services/categoryService';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'expense', color: '#2563eb' });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await categoryService.create(formData);
      setShowForm(false);
      setFormData({ name: '', type: 'expense', color: '#2563eb' });
      loadCategories();
    } catch (error) {
      alert('Error creating category');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category? This will fail if it has transactions.')) {
      try {
        await categoryService.delete(id);
        loadCategories();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting category');
      }
    }
  };

  const expenseCategories = categories.filter(c => c.type === 'expense');
  const incomeCategories = categories.filter(c => c.type === 'income');

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--gray-900)' }}>Categories</h1>
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
          {showForm ? 'Cancel' : '+ Add Category'}
        </button>
      </div>

      {showForm && (
        <div className="card fade-in" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>New Category</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--gray-700)' }}>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius)' }}
                />
              </div>
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
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--gray-700)' }}>Color</label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  style={{ width: '100%', padding: '0.25rem', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius)', height: '38px' }}
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
              Add Category
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="fade-in">
          <h2 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>Expense Categories</h2>
          <div className="card">
            {expenseCategories.length === 0 ? (
              <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-600)' }}>No expense categories</p>
            ) : (
              expenseCategories.map(cat => (
                <div key={cat.category_id} style={{ padding: '1rem', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: cat.color, border: '2px solid var(--gray-100)' }} />
                    <span style={{ fontWeight: '500', color: 'var(--gray-900)' }}>{cat.name}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(cat.category_id)}
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
              ))
            )}
          </div>
        </div>

        <div className="fade-in">
          <h2 style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>Income Categories</h2>
          <div className="card">
            {incomeCategories.length === 0 ? (
              <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-600)' }}>No income categories</p>
            ) : (
              incomeCategories.map(cat => (
                <div key={cat.category_id} style={{ padding: '1rem', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: cat.color, border: '2px solid var(--gray-100)' }} />
                    <span style={{ fontWeight: '500', color: 'var(--gray-900)' }}>{cat.name}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(cat.category_id)}
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
