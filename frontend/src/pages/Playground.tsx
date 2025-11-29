export default function Playground() {
  return (
    <div className="container mx-auto px-6 py-12 text-gray-200 space-y-6">
      <h1 className="text-4xl font-bold text-white mb-2">
        Protocol Playground (Planned)
      </h1>
      <p className="text-lg text-gray-300 max-w-3xl">
        This page will become the interactive area where students configure test
        scenarios and compare HTTP/1.1, HTTP/2, and HTTP/3. For now, we define
        the layout and responsibilities.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-2">
          <h2 className="text-xl font-semibold text-white">
            Scenario Builder (Person C)
          </h2>
          <p className="text-gray-300 text-sm">
            TODO: form to choose number of assets, their sizes, which protocol
            to use, and simulated network conditions (latency, loss, bandwidth).
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-2">
          <h2 className="text-xl font-semibold text-white">
            Results & Charts (Person C)
          </h2>
          <p className="text-gray-300 text-sm">
            TODO: charts / tables that show total load time, per-request timing,
            and differences between HTTP/1.1, HTTP/2, and HTTP/3.
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-400 italic">
        Implementation of the playground logic and charts is planned for the
        next milestone.
      </p>
    </div>
  );
}
