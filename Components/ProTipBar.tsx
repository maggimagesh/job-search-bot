import { useTheme } from '../contexts/ThemeContext';
import GoogleIcons from './GoogleIcons';

export default function ProTipBar() {
  const { theme } = useTheme();
  
  return (
    <div className="surface" style={{
      margin: 'var(--space-sm) 0 var(--space-lg)',
      padding: 'var(--space-md) var(--space-lg)',
      color: 'var(--text-primary)',
      fontSize: 14,
      fontWeight: theme === 'google' ? 'var(--font-weight-medium)' : 500,
      textTransform: theme === 'google' ? 'none' : 'uppercase',
      letterSpacing: theme === 'google' ? '0.1px' : '0.5px',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-sm)',
      fontFamily: 'var(--font-family)',
    }}>
      {theme === 'google' ? (
        <GoogleIcons name="lightbulb" size={18} color="var(--accent-warning)" />
      ) : (
        <span role="img" aria-label="tips" style={{ color: 'var(--accent-warning)', fontSize: '18px' }}>💡</span>
      )}
      Pro tip: Each portal has unique opportunities. Check them all for the best results!
    </div>
  );
}
  