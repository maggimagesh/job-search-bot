import { FaSearch, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function JobSearchForm({
  role, setRole, location, setLocation, searchJobs, loading
}: any) {
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

  // --- Gradient theme for the Search Jobs button ---
  const searchButtonGradient = loading
    ? 'linear-gradient(90deg,#dbd7fb,#ebd9fa 94%)'
    : 'linear-gradient(90deg, #9150fa 0%, #f3c6fe 100%)';

  return (
    <form
      onSubmit={searchJobs}
      style={{
        background: 'rgba(255,255,255,0.05)',
        padding: '30px',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '900px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}
    >
      {/* Role Input */}
      <label style={{ display: 'block', fontSize: '16px', marginBottom: '8px' }}>
        <FaBriefcase style={{ marginRight: '6px' }} /> Job Role
      </label>
      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Enter job role"
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.3)',
          background: 'transparent',
          color: '#fff',
          marginBottom: '20px',
          fontSize: '16px'
        }}
      />
      <div style={{ marginBottom: '20px' }}>
        <span style={{ fontSize: '14px', marginRight: '8px', opacity: 0.8 }}>
          {dataLoading ? 'Loading Popular Roles...' : 'Popular Roles:'}
        </span>
        {!dataLoading && popularRoles.map((r) => (
          <button
            key={r} type="button"
            onClick={() => setRole(r)}
            style={{
              margin: '4px',
              padding: '6px 12px',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }}
          >{r}</button>
        ))}
      </div>
      {/* Location Input */}
      <label style={{ display: 'block', fontSize: '16px', marginBottom: '8px' }}>
        <FaMapMarkerAlt style={{ marginRight: '6px' }} /> Location
      </label>
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter location"
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.3)',
          background: 'transparent',
          color: '#fff',
          marginBottom: '20px',
          fontSize: '16px'
        }}
      />
      <div style={{ marginBottom: '20px' }}>
        <span style={{ fontSize: '14px', marginRight: '8px', opacity: 0.8 }}>
          {dataLoading ? 'Loading Trending Locations...' : 'Trending Locations:'}
        </span>
        {!dataLoading && trendingLocations.map((loc) => (
          <button
            key={loc} type="button"
            onClick={() => setLocation(loc)}
            style={{
              margin: '4px',
              padding: '6px 12px',
              background: 'rgba(0,200,255,0.2)',
              border: 'none', 
              borderRadius: '12px',
              color: '#fff', 
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(0,200,255,0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(0,200,255,0.2)';
            }}
          >{loc}</button>
        ))}
      </div>
      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '14px',
          fontSize: '18px',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '14px',
          background: searchButtonGradient,
          color: '#fff', 
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          boxShadow: loading
            ? '0px 2px 10px #e4e4fa'
            : '0px 4px 20px rgba(145,80,250,0.21)',
          transition: 'box-shadow .19s, transform .15s, background .18s',
          marginTop: '18px',
        }}
        onMouseOver={(e) => {
          if (!loading) {
            e.currentTarget.style.boxShadow = '0px 8px 38px #9150fa33';
            e.currentTarget.style.transform = 'scale(1.03)';
          }
        }}
        onMouseOut={(e) => {
          if (!loading) {
            e.currentTarget.style.boxShadow =
              '0px 4px 20px rgba(145,80,250,0.21)';
            e.currentTarget.style.transform = 'none';
          }
        }}
      >
        <FaSearch style={{ marginRight: '8px' }} /> 
        {loading ? 'Searching...' : 'Search Jobs'}
      </button>
    </form>
  );
}
