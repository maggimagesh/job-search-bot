export default function ProTipBar() {
    return (
      <div className="surface" style={{
        margin: 'var(--space-sm) 0 var(--space-lg)',
        padding: 'var(--space-md) var(--space-lg)',
        color: 'var(--text-primary)',
        fontSize: 14,
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)',
      }}>
        <span role="img" aria-label="tips" style={{ color: 'var(--accent-warning)', fontSize: '18px' }}>💡</span>
        Pro tip: Each portal has unique opportunities. Check them all for the best results!
      </div>
    );
  }
  