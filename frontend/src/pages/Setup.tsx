export default function Setup() {
  return (
    <div className="container mx-auto px-6 py-12 text-gray-200 space-y-6">
      <h1 className="text-4xl font-bold text-white mb-2">
        Setup Instructions (Draft)
      </h1>
      <p className="text-lg text-gray-300 max-w-3xl">
        This page will eventually contain full step-by-step instructions for
        running the backend, the HTTP/1.1 / HTTP/2 / HTTP/3 proxy, and this
        frontend app. For now, we outline the main steps.
      </p>

      <ol className="list-decimal list-inside space-y-2 text-gray-300">
        <li>Install Node.js and npm.</li>
        <li>Install Java 17+ and Maven or Gradle.</li>
        <li>Clone the project repository.</li>
        <li>TODO (Person A): exact commands to start the Spring Boot backend.</li>
        <li>
          TODO (Person D): exact configuration / commands for the HTTP/3-capable
          proxy (e.g., Caddy or nginx).
        </li>
        <li>
          Start the frontend:
          <pre className="mt-1 rounded bg-slate-900/70 p-2 text-xs">
            cd frontend{"\n"}npm install{"\n"}npm run dev
          </pre>
        </li>
      </ol>
    </div>
  );
}
