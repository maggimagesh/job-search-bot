import { useEffect, useState } from 'react';

const portalIcons: any = {
  Naukri: (
    <span
      style={{
        fontSize: 28,
        background: "#3a0ca3",
        color: "#fff",
        borderRadius: "8px",
        padding: "4px",
      }}
    >
      💼
    </span>
  ),
  Indeed: (
    <span
      style={{
        fontSize: 28,
        background: "#ff0080",
        color: "#fff",
        borderRadius: "8px",
        padding: "4px",
      }}
    >
      🎯
    </span>
  ),
  LinkedIn: (
    <span
      style={{
        fontSize: 28,
        background: "#0bc2e6",
        color: "#fff",
        borderRadius: "8px",
        padding: "4px",
      }}
    >
      💡
    </span>
  ),
  Glassdoor: (
    <span
      style={{
        fontSize: 28,
        background: "#34e8c7",
        color: "#fff",
        borderRadius: "8px",
        padding: "4px",
      }}
    >
      🚀
    </span>
  ),
  TimesJobs: (
    <span
      style={{
        fontSize: 28,
        background: "#2c5aa0",
        color: "#fff",
        borderRadius: "8px",
        padding: "4px",
      }}
    >
      ⏰
    </span>
  ),
  Shine: (
    <span
      style={{
        fontSize: 28,
        background: "#ffd700",
        color: "#000",
        borderRadius: "8px",
        padding: "4px",
      }}
    >
      ✨
    </span>
  ),
  HackerRank: (
    <span
      style={{
        fontSize: 28,
        background: "#00ea64",
        color: "#000",
        borderRadius: "8px",
        padding: "4px",
      }}
    >
      🎯
    </span>
  ),
  Upwork: (
    <span
      style={{
        fontSize: 28,
        background: "#14a800",
        color: "#fff",
        borderRadius: "8px",
        padding: "4px",
      }}
    >
      🔧
    </span>
  ),
  Freelancer: (
    <span
      style={{
        fontSize: 28,
        background: "#29b2fe",
        color: "#fff",
        borderRadius: "8px",
        padding: "4px",
      }}
    >
      🎨
    </span>
  ),
  FoundIt: (
    <span
      style={{
        fontSize: 28,
        background: "#00bfff",
        color: "#fff",
        borderRadius: "8px",
        padding: "4px",
      }}
    >
      🌐
    </span>
  ),
};

export default function JobPortalResults({ portals, role, location }: any) {
  const [isBackgroundVisible, setIsBackgroundVisible] = useState(false);
  const [isCardsVisible, setIsCardsVisible] = useState(false);

  useEffect(() => {
    // First animate the background box from bottom to top
    const backgroundTimer = setTimeout(() => {
      setIsBackgroundVisible(true);
    }, 100);

    // Then animate the cards from left to right with bounce effect
    const cardsTimer = setTimeout(() => {
      setIsCardsVisible(true);
    }, 870); // Start after background animation completes (decreased from 1000ms)

    return () => {
      clearTimeout(backgroundTimer);
      clearTimeout(cardsTimer);
    };
  }, []);

  if (!portals?.length) return null;

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.05)',
        padding: '30px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        transform: isBackgroundVisible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.744s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.744s ease-out',
        opacity: isBackgroundVisible ? 1 : 0,
      }}
    >
      <div style={{ fontWeight: 600, fontSize: "1.2rem", marginBottom: 15 }}>
        Search Results for{" "}
        <span style={{ color: "#00fff6", fontWeight: 700 }}>&ldquo;{role}&rdquo;</span> in{" "}
        <span style={{ color: "#a786ff", fontWeight: 700 }}>{location}</span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 18,
          marginBottom: 23,
        }}
      >
        {portals.map((p: any, i: number) => (
          <a
            key={`${p.name}-${p.url}`}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(255,255,255,0.08)",
              borderRadius: 15,
              padding: "19px 16px",
              textDecoration: "none",
              color: "#fff",
              fontSize: "17px",
              gap: 13,
              transform: isCardsVisible ? 'translateX(0) scale(1)' : 'translateX(-100px) scale(0.8)',
              opacity: isCardsVisible ? 1 : 0,
              transition: `all 0.652s cubic-bezier(0.68, -0.55, 0.265, 1.55)`,
              transitionDelay: `${i * 0.13}s`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
            }}
          >
            <div style={{ flexShrink: 0 }}>
              {portalIcons[p.name] || <span style={{ fontSize: 24 }}>🌐</span>}
            </div>
            <div>
              <span style={{ fontWeight: 700 }}>{p.name}</span>
              <br />
              <span style={{ fontSize: 13, color: "#bdb6e9" }}>
                Search results page
              </span>
            </div>
            <div style={{ marginLeft: "auto", fontSize: 24, opacity: 0.55 }}>
              🔎
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
