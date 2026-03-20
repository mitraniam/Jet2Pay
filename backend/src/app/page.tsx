export default function Home() {
  return (
    <div style={{ fontFamily: "system-ui", padding: "2rem", textAlign: "center" }}>
      <h1>Jet2Pay API</h1>
      <p>Flight compensation claims backend is running.</p>
      <p><a href="/api/health">Health Check</a></p>
    </div>
  );
}
