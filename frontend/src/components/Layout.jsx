import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <nav style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link to="/dashboard" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb', textDecoration: 'none' }}>
              Spendly
            </Link>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link
                to="/dashboard"
                style={{
                  textDecoration: 'none',
                  color: isActive('/dashboard') ? '#2563eb' : '#4b5563',
                  fontWeight: isActive('/dashboard') ? '600' : '400',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  backgroundColor: isActive('/dashboard') ? '#eff6ff' : 'transparent'
                }}
              >
                Dashboard
              </Link>
              <Link
                to="/transactions"
                style={{
                  textDecoration: 'none',
                  color: isActive('/transactions') ? '#2563eb' : '#4b5563',
                  fontWeight: isActive('/transactions') ? '600' : '400',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  backgroundColor: isActive('/transactions') ? '#eff6ff' : 'transparent'
                }}
              >
                Transactions
              </Link>
              <Link
                to="/categories"
                style={{
                  textDecoration: 'none',
                  color: isActive('/categories') ? '#2563eb' : '#4b5563',
                  fontWeight: isActive('/categories') ? '600' : '400',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  backgroundColor: isActive('/categories') ? '#eff6ff' : 'transparent'
                }}
              >
                Categories
              </Link>
              <Link
                to="/budgets"
                style={{
                  textDecoration: 'none',
                  color: isActive('/budgets') ? '#2563eb' : '#4b5563',
                  fontWeight: isActive('/budgets') ? '600' : '400',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  backgroundColor: isActive('/budgets') ? '#eff6ff' : 'transparent'
                }}
              >
                Budgets
              </Link>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: '#6b7280' }}>
              {user?.firstName} {user?.lastName}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
