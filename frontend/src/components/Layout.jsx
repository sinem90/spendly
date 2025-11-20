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
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--gray-50)' }}>
      <nav style={{
        background: 'linear-gradient(135deg, #1e4541 0%, #2a6460 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '0.75rem 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '0.5rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.25rem',
                color: 'var(--primary)'
              }}>
                $
              </div>
              <span style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>Spendly</span>
            </Link>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link
                to="/dashboard"
                style={{
                  textDecoration: 'none',
                  color: 'white',
                  fontWeight: isActive('/dashboard') ? '600' : '400',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  backgroundColor: isActive('/dashboard') ? 'rgba(255,255,255,0.2)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/dashboard')) e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/dashboard')) e.target.style.backgroundColor = 'transparent';
                }}
              >
                Dashboard
              </Link>
              <Link
                to="/transactions"
                style={{
                  textDecoration: 'none',
                  color: 'white',
                  fontWeight: isActive('/transactions') ? '600' : '400',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  backgroundColor: isActive('/transactions') ? 'rgba(255,255,255,0.2)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/transactions')) e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/transactions')) e.target.style.backgroundColor = 'transparent';
                }}
              >
                Transactions
              </Link>
              <Link
                to="/categories"
                style={{
                  textDecoration: 'none',
                  color: 'white',
                  fontWeight: isActive('/categories') ? '600' : '400',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  backgroundColor: isActive('/categories') ? 'rgba(255,255,255,0.2)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/categories')) e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/categories')) e.target.style.backgroundColor = 'transparent';
                }}
              >
                Categories
              </Link>
              <Link
                to="/budgets"
                style={{
                  textDecoration: 'none',
                  color: 'white',
                  fontWeight: isActive('/budgets') ? '600' : '400',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  backgroundColor: isActive('/budgets') ? 'rgba(255,255,255,0.2)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/budgets')) e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/budgets')) e.target.style.backgroundColor = 'transparent';
                }}
              >
                Budgets
              </Link>
              <Link
                to="/reports"
                style={{
                  textDecoration: 'none',
                  color: 'white',
                  fontWeight: isActive('/reports') ? '600' : '400',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  backgroundColor: isActive('/reports') ? 'rgba(255,255,255,0.2)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isActive('/reports')) e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive('/reports')) e.target.style.backgroundColor = 'transparent';
                }}
              >
                Reports
              </Link>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '500' }}>
              {user?.firstName} {user?.lastName}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1.25rem',
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.25)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.15)';
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
