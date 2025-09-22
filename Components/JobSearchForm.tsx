import { FaSearch, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import GoogleIcons from './GoogleIcons';

export default function JobSearchForm({
  role, setRole, location, setLocation, searchJobs, loading
}: any) {
  const { theme } = useTheme();
  const [popularRoles, setPopularRoles] = useState<string[]>([]);
  const [trendingLocations, setTrendingLocations] = useState<string[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchPopularData = async () => {
      try {
        const response = await fetch('/api/popular-data');
        const data = await response.json();
        setPopularRoles(data.popularRoles || []);
        setTrendingLocations(data.trendingLocations || []);
      } catch (error) {
        // Fallback static data
        setPopularRoles([
          'Java Full Stack Developer', 
          'Frontend Developer', 
          'Data Scientist', 
          'Product Manager', 
          'UX Designer', 
          'DevOps Engineer'
        ]);
        setTrendingLocations([
          'Chennai', 
          'Bangalore', 
          'Mumbai', 
          'Delhi', 
          'Hyderabad', 
          'Pune'
        ]);
      } finally {
        setDataLoading(false);
      }
    };

    fetchPopularData();
  }, []);


  return (
    <form
      onSubmit={searchJobs}
      className="card"
      style={{
        width: '100%',
        maxWidth: '900px',
        margin: '0 auto',
        padding: 'var(--space-2xl)',
      }}
    >
      {/* Role Input */}
      <label style={{ 
        fontSize: '14px', 
        marginBottom: 'var(--space-sm)',
        color: 'var(--text-secondary)',
        fontWeight: theme === 'google' ? 'var(--font-weight-medium)' : '600',
        textTransform: theme === 'google' ? 'none' : 'uppercase',
        letterSpacing: theme === 'google' ? '0.1px' : '0.5px',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)'
      }}>
        {theme === 'google' ? (
          <GoogleIcons name="work" size={20} color="var(--google-blue)" />
        ) : (
          <FaBriefcase style={{ color: 'var(--accent-primary)' }} />
        )}
        Job Role
      </label>
      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Enter job role"
        className="input"
        style={{
          marginBottom: 'var(--space-lg)',
        }}
      />
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <span style={{ 
          fontSize: '12px', 
          marginRight: 'var(--space-sm)', 
          color: 'var(--text-tertiary)',
          fontWeight: theme === 'google' ? 'var(--font-weight-medium)' : '600',
          textTransform: theme === 'google' ? 'none' : 'uppercase',
          letterSpacing: theme === 'google' ? '0.1px' : '0.5px'
        }}>
          {dataLoading ? 'Loading Popular Roles...' : 'Popular Roles:'}
        </span>
        {!dataLoading && popularRoles.map((r) => (
          <button
            key={r} 
            type="button"
            onClick={() => setRole(r)}
            className="btn-secondary"
            style={{
              margin: 'var(--space-xs)',
              padding: theme === 'google' ? '8px 16px' : 'var(--space-sm) var(--space-md)',
              fontSize: '12px',
              textTransform: theme === 'google' ? 'none' : 'uppercase',
              letterSpacing: theme === 'google' ? '0.1px' : '0.3px',
              borderRadius: theme === 'google' ? '16px' : 'var(--radius-sm)',
            }}
          >{r}</button>
        ))}
      </div>
      {/* Location Input */}
      <label style={{ 
        fontSize: '14px', 
        marginBottom: 'var(--space-sm)',
        color: 'var(--text-secondary)',
        fontWeight: theme === 'google' ? 'var(--font-weight-medium)' : '600',
        textTransform: theme === 'google' ? 'none' : 'uppercase',
        letterSpacing: theme === 'google' ? '0.1px' : '0.5px',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)'
      }}>
        {theme === 'google' ? (
          <GoogleIcons name="location" size={20} color="var(--google-blue)" />
        ) : (
          <FaMapMarkerAlt style={{ color: 'var(--accent-primary)' }} />
        )}
        Location
      </label>
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter location"
        className="input"
        style={{
          marginBottom: 'var(--space-lg)',
        }}
      />
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <span style={{ 
          fontSize: '12px', 
          marginRight: 'var(--space-sm)', 
          color: 'var(--text-tertiary)',
          fontWeight: theme === 'google' ? 'var(--font-weight-medium)' : '600',
          textTransform: theme === 'google' ? 'none' : 'uppercase',
          letterSpacing: theme === 'google' ? '0.1px' : '0.5px'
        }}>
          {dataLoading ? 'Loading Trending Locations...' : 'Trending Locations:'}
        </span>
        {!dataLoading && trendingLocations.map((loc) => (
          <button
            key={loc} 
            type="button"
            onClick={() => setLocation(loc)}
            className="btn-secondary"
            style={{
              margin: 'var(--space-xs)',
              padding: theme === 'google' ? '8px 16px' : 'var(--space-sm) var(--space-md)',
              fontSize: '12px',
              textTransform: theme === 'google' ? 'none' : 'uppercase',
              letterSpacing: theme === 'google' ? '0.1px' : '0.3px',
              borderRadius: theme === 'google' ? '16px' : 'var(--radius-sm)',
            }}
          >{loc}</button>
        ))}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn-primary"
        style={{
          width: '100%',
          padding: theme === 'google' ? '12px 24px' : 'var(--space-md)',
          fontSize: '16px',
          fontWeight: theme === 'google' ? 'var(--font-weight-medium)' : '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          marginTop: 'var(--space-lg)',
          textTransform: theme === 'google' ? 'none' : 'uppercase',
          letterSpacing: theme === 'google' ? '0.1px' : '0.5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-sm)',
        }}
        onMouseOver={(e) => {
          if (!loading) {
            if (theme === 'google') {
              e.currentTarget.style.background = 'var(--google-blue-hover)';
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(60, 64, 67, 0.3), 0 4px 8px 3px rgba(60, 64, 67, 0.15)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            } else {
              e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg), var(--shadow-glow-hover)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }
          }
        }}
        onMouseOut={(e) => {
          if (!loading) {
            if (theme === 'google') {
              e.currentTarget.style.background = 'var(--google-blue)';
              e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15)';
              e.currentTarget.style.transform = 'none';
            } else {
              e.currentTarget.style.background = 'linear-gradient(135deg, var(--accent-primary) 0%, #3b82f6 100%)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md), var(--shadow-glow)';
              e.currentTarget.style.transform = 'none';
            }
          }
        }}
      >
        {theme === 'google' ? (
          <GoogleIcons name="search" size={20} color="var(--text-on-primary)" />
        ) : (
          <FaSearch />
        )}
        {loading ? 'Searching...' : 'Search Jobs'}
      </button>
    </form>
  );
}
