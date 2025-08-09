export default function AdzunaLiveJobs({ jobs }: any) {
    if (!jobs?.length) return null;
    return (
      <div>
        <h3 style={{ margin: '20px 0 12px', color: "#ff77c9", fontSize: "1.20rem" }}>
          Live jobs from us to you
        </h3>
        <ul style={{ paddingLeft: 22 }}>
          {jobs.map((j: any, i: number) => (
            <li key={i} style={{ marginBottom: 8, color: "#fff" }}>
              <a href={j.url} target="_blank" rel="noreferrer"
                style={{ color: "#00ffc5", fontWeight: 600, textDecoration: "underline" }}>
                {j.title}
              </a> — <span style={{ color: "#d1b7ff" }}>{j.company}</span> — {j.location}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  