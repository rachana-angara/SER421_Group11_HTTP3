import { Zap, Network, BarChart3, Wifi, ArrowRight } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center space-x-2">
          <Network className="w-8 h-8 text-blue-400" />
          <span className="text-2xl font-bold text-white">Protocol Racer</span>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Experience the
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Speed Revolution</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Compare HTTP/2 and HTTP/3 performance in real-time. Visualize multiplexing, header compression, and latency effects through interactive charts and live network simulations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2">
              <span>Start Comparison</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white text-lg font-semibold rounded-lg transition-all duration-200 transform hover:scale-105">
              Start Tutorial
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <FeatureCard
            icon={<Zap className="w-12 h-12 text-yellow-400" />}
            title="Real-Time Performance"
            description="Watch protocols race side-by-side with live metrics showing speed, latency, and throughput differences."
          />
          <FeatureCard
            icon={<BarChart3 className="w-12 h-12 text-green-400" />}
            title="Interactive Charts"
            description="Visualize multiplexing streams, header compression ratios, and connection efficiency through dynamic animations."
          />
          <FeatureCard
            icon={<Wifi className="w-12 h-12 text-blue-400" />}
            title="Network Simulation"
            description="Simulate various network conditions including packet loss, high latency, and bandwidth throttling."
          />
        </div>

        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Why Compare?</h2>
              <ul className="space-y-4 text-gray-300 text-lg">
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Understand the performance benefits of modern web protocols</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Learn how HTTP/3's QUIC transport improves reliability</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>See multiplexing and head-of-line blocking solutions in action</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span>Make informed decisions about protocol adoption</span>
                </li>
              </ul>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
              <h3 className="text-2xl font-bold text-white mb-6">Key Metrics</h3>
              <div className="space-y-4">
                <MetricRow label="Connection Time" value="-50%" positive />
                <MetricRow label="Latency Impact" value="-40%" positive />
                <MetricRow label="Packet Loss Resilience" value="+85%" positive />
                <MetricRow label="Multiplexing Efficiency" value="+95%" positive />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-6 py-12 text-center text-gray-400 border-t border-gray-800 mt-20">
        <p>Built to demonstrate the power of modern web transport protocols</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

function MetricRow({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-300">{label}</span>
      <span className={`text-lg font-bold ${positive ? 'text-green-400' : 'text-red-400'}`}>
        {value}
      </span>
    </div>
  );
}

export default App;
