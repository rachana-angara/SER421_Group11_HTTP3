export default function Setup() {
  return (
    <div className="container mx-auto px-6 py-12 text-gray-200 space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-white mb-2">
          Setup & Running the Project Locally
        </h1>
        <p className="text-lg text-gray-300 max-w-3xl">
          This page summarizes how to run the Spring Boot backend, build the React
          frontend, and serve everything through Caddy using HTTP/1.1, HTTP/2, and
          HTTP/3. A more detailed version of these steps lives in{' '}
          <code className="bg-slate-800 px-2 py-1 rounded text-xs">
            docs/protocol-setup.md
          </code>.
        </p>
      </header>

      {/* 1. Prerequisites */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-3">
        <h2 className="text-2xl font-semibold text-white">1. Prerequisites</h2>
        <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
          <li>Java 17+ and Maven</li>
          <li>Node.js and npm</li>
          <li>Caddy installed and available on PATH</li>
          <li>A modern browser (Chrome, Edge, or Firefox)</li>
          <li>Windows with access to edit the <code>hosts</code> file</li>
        </ul>
      </section>

      {/* 2. Hosts file */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-3">
        <h2 className="text-2xl font-semibold text-white">2. Hostnames configuration</h2>
        <p className="text-gray-300 text-sm">
          Edit <code>C:\Windows\System32\drivers\etc\hosts</code> as Administrator and
          add these lines (if they are not already present):
        </p>
        <pre className="mt-2 rounded bg-slate-950/70 p-3 text-xs text-gray-200 overflow-x-auto">
{`127.0.0.1  http1.localhost
127.0.0.1  h2.localhost
127.0.0.1  h3.localhost`}
        </pre>
        <p className="text-gray-400 text-xs">
          You can verify with <code>ping http1.localhost</code>, <code>ping h2.localhost</code>,
          and <code>ping h3.localhost</code>; each should resolve to <code>127.0.0.1</code>.
        </p>
      </section>

      {/* 3. Backend */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-3">
        <h2 className="text-2xl font-semibold text-white">3. Start the backend (Spring Boot)</h2>
        <p className="text-gray-300 text-sm">
          From the project root, run the Spring Boot application. This exposes
          resource endpoints under <code>/api</code> on port <code>8080</code>.
        </p>
        <pre className="mt-2 rounded bg-slate-950/70 p-3 text-xs text-gray-200 overflow-x-auto">
{`cd backend
mvn spring-boot:run`}
        </pre>
        <p className="text-gray-300 text-sm mt-2">
          Sanity check:
        </p>
        <pre className="mt-1 rounded bg-slate-950/70 p-3 text-xs text-gray-200 overflow-x-auto">
{`curl http://localhost:8080/api/health
curl http://localhost:8080/api/protocol`}
        </pre>
        <p className="text-gray-400 text-xs">
          Expected: <code>/api/health</code> returns <code>{"{\"status\":\"ok\"}"}</code> and
          <code> /api/protocol</code> returns something like <code>{"{\"protocol\":\"HTTP/1.1\"}"}</code>.
        </p>
      </section>

      {/* 4. Frontend build */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-3">
        <h2 className="text-2xl font-semibold text-white">4. Build the frontend</h2>
        <p className="text-gray-300 text-sm">
          The frontend is a React + TypeScript app built with Vite. We build it once
          and let Caddy serve the compiled assets from <code>frontend/dist</code>.
        </p>
        <pre className="mt-2 rounded bg-slate-950/70 p-3 text-xs text-gray-200 overflow-x-auto">
{`cd frontend
npm install
npm run build`}
        </pre>
        <p className="text-gray-400 text-xs">
          After this, you should have a <code>frontend/dist</code> folder containing
          <code>index.html</code> and static assets.
        </p>
      </section>

      {/* 5. Caddy */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-3">
        <h2 className="text-2xl font-semibold text-white">5. Run Caddy (HTTP/1.1 / HTTP/2 / HTTP/3)</h2>
        <p className="text-gray-300 text-sm">
          Caddy serves the built frontend and proxies <code>/api</code> requests to the
          Spring Boot backend. It also exposes three different origins for protocol testing:
          <code>http1.localhost</code>, <code>h2.localhost</code>, and <code>h3.localhost</code>.
        </p>
        <p className="text-gray-300 text-sm">
          The Caddyfile used in our project lives in <code>proxy/Caddyfile</code> and looks like:
        </p>
        <pre className="mt-2 rounded bg-slate-950/70 p-3 text-xs text-gray-200 overflow-x-auto">
{`{
  auto_https disable_redirects
}

http://http1.localhost:8081 {
  root * "C:/Users/sahil/OneDrive/Desktop/SER 421 Project/SER421_Group11_HTTP3/frontend/dist"
  file_server
  reverse_proxy /api/* http://localhost:8080
}

https://h2.localhost:8443 {
  tls internal
  root * "C:/Users/sahil/OneDrive/Desktop/SER 421 Project/SER421_Group11_HTTP3/frontend/dist"
  file_server
  reverse_proxy /api/* http://localhost:8080
}

https://h3.localhost:9443 {
  tls internal
  root * "C:/Users/sahil/OneDrive/Desktop/SER 421 Project/SER421_Group11_HTTP3/frontend/dist"
  file_server
  reverse_proxy /api/* http://localhost:8080
}`}
        </pre>
        <p className="text-gray-300 text-sm mt-2">
          To run Caddy:
        </p>
        <pre className="mt-1 rounded bg-slate-950/70 p-3 text-xs text-gray-200 overflow-x-auto">
{`cd proxy
caddy run --config Caddyfile --adapter caddyfile`}
        </pre>
        <p className="text-gray-400 text-xs">
          The first time, Windows may prompt for firewall access; allow access for private networks.
        </p>
      </section>

      {/* 6. Verifying protocols */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-3">
        <h2 className="text-2xl font-semibold text-white">6. Verifying protocols (DevTools)</h2>
        <p className="text-gray-300 text-sm">
          Use your browser&apos;s Network panel to confirm which protocol is used for each host.
          This is part of <strong>Lab 1</strong>.
        </p>
        <ol className="list-decimal list-inside text-gray-300 text-sm space-y-1">
          <li>Open DevTools → Network → right-click the header row → enable the “Protocol” column.</li>
          <li>Check “Disable cache”.</li>
          <li>Visit <code>http://http1.localhost:8081</code> and reload; you should see <code>http/1.1</code>.</li>
          <li>Visit <code>https://h2.localhost:8443</code> and reload; you should see <code>h2</code>.</li>
          <li>Visit <code>https://h3.localhost:9443</code> and reload; modern browsers may show <code>h3</code> for HTTP/3 or <code>h2</code> as a fallback.</li>
        </ol>
        <p className="text-gray-400 text-xs">
          Screenshots of these Network panels are used in both the Labs and the project report as evidence.
        </p>
      </section>

      {/* 7. Next steps */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-3">
        <h2 className="text-2xl font-semibold text-white">7. Next steps</h2>
        <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
          <li>Visit the <strong>Learn</strong> page to review HTTP/1.1 vs HTTP/2 vs HTTP/3 concepts.</li>
          <li>Use the <strong>Playground</strong> to run simulations and visualize latency and multiplexing.</li>
          <li>Follow the <strong>Labs</strong> page for step-by-step experiments that feed into the analytical report.</li>
        </ul>
        <p className="text-gray-400 text-xs">
          For a full, text-based version of these steps (including curl output and troubleshooting), see{' '}
          <code>docs/protocol-setup.md</code> in the repository.
        </p>
      </section>
    </div>
  );
}
