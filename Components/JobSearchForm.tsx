import { FaSearch, FaMapMarkerAlt, FaBriefcase } from 'react-icons/fa';

const popularRoles = [
  'Java Full Stack Developer', 'Frontend Developer', 'Data Scientist', 'Product Manager', 'UX Designer', 'DevOps Engineer'
];
const trendingLocations = ['Chennai', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune'];

export default function JobSearchForm({
  role, setRole, location, setLocation, searchJobs
}: any) {
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
        <span style={{ fontSize: '14px', marginRight: '8px', opacity: 0.8 }}>Popular Roles:</span>
        {popularRoles.map((r) => (
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
              cursor: 'pointer'
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
        <span style={{ fontSize: '14px', marginRight: '8px', opacity: 0.8 }}>Trending Locations:</span>
        {trendingLocations.map((loc) => (
          <button
            key={loc} type="button"
            onClick={() => setLocation(loc)}
            style={{
              margin: '4px',
              padding: '6px 12px',
              background: 'rgba(0,200,255,0.2)',
              border: 'none', borderRadius: '12px',
              color: '#fff', cursor: 'pointer'
            }}
          >{loc}</button>
        ))}
      </div>
      <button
        type="submit"
        style={{
          width: '100%',
          padding: '14px',
          fontSize: '18px',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '8px',
          background: 'linear-gradient(90deg, #ff0080, #ff4d4d)',
          color: '#fff', cursor: 'pointer'
        }}
      ><FaSearch style={{ marginRight: '8px' }} /> Search Jobs
      </button>
    </form>
  );
}
