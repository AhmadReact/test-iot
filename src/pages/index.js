export default function Home() {
  return (
    <main style={{ fontFamily: 'Inter, Arial, sans-serif', padding: 24 }}>
      <h1 style={{ marginBottom: 12 }}>Next.js migration bootstrap is ready</h1>
      <p style={{ marginBottom: 8 }}>
        This project now supports running Next.js in parallel with the existing CRA app.
      </p>
      <p style={{ marginBottom: 8 }}>
        Start it with <code>npm run next:dev</code> and migrate pages gradually.
      </p>
      <p>
        API requests can use <code>/api/*</code>, which are proxied server-side with secure env
        variables.
      </p>
    </main>
  );
}
