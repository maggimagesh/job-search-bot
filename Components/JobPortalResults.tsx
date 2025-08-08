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
};

export default function JobPortalResults({ portals, role, location }: any) {
  if (!portals?.length) return null;
  return (
      <div>
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
            key={i}
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
