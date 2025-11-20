const PageHeader = ({ title, subtitle, action }) => {
  return (
    <div className="fade-in" style={{
      background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)',
      padding: '2rem',
      marginBottom: '2rem',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{
            margin: 0,
            fontSize: '2rem',
            fontWeight: '700',
            marginBottom: subtitle ? '0.5rem' : 0
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{
              margin: 0,
              fontSize: '1rem',
              opacity: 0.9,
              fontWeight: '400'
            }}>
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <div>
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
