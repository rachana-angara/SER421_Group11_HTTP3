import { Zap, Network, BarChart3, Wifi, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';

function App() {
  const [view, setView] = useState<'home' | 'protocol-select' | 'visualization'>('home');
  const [selectedProtocol, setSelectedProtocol] = useState<'http2' | 'http3' | null>(null);

  const handleProtocolSelect = (protocol: 'http2' | 'http3') => {
    setSelectedProtocol(protocol);
    setView('visualization');
  };

  const handleBackToHome = () => {
    setView('home');
    setSelectedProtocol(null);
  };

  if (view === 'visualization' && selectedProtocol) {
    return <VisualizationPage protocol={selectedProtocol} onBack={handleBackToHome} />;
  }

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
            <button onClick={() => setView('protocol-select')} className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2">
              <span>Start Comparison</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white text-lg font-semibold rounded-lg transition-all duration-200 transform hover:scale-105">
              Start Tutorial
            </button>
          </div>

          {view === 'protocol-select' && (
            <ProtocolSelectModal onSelect={handleProtocolSelect} onClose={handleBackToHome} />
          )}
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

function ProtocolSelectModal({ onSelect, onClose }: { onSelect: (protocol: 'http2' | 'http3') => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Select Protocol</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <p className="text-gray-300 mb-8">Choose a protocol to visualize its performance characteristics</p>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => onSelect('http2')}
            className="group p-6 bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-2 border-blue-500/50 hover:border-blue-400 rounded-xl transition-all duration-300 hover:from-blue-500/30 hover:to-blue-600/30 text-left"
          >
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">HTTP/2</h3>
            <p className="text-gray-300 mb-4">Experience the modern HTTP protocol with multiplexing and header compression</p>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>✓ Multiplexing support</li>
              <li>✓ Header compression (HPACK)</li>
              <li>✓ Binary framing</li>
            </ul>
          </button>

          <button
            onClick={() => onSelect('http3')}
            className="group p-6 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-2 border-cyan-500/50 hover:border-cyan-400 rounded-xl transition-all duration-300 hover:from-cyan-500/30 hover:to-blue-600/30 text-left"
          >
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">HTTP/3</h3>
            <p className="text-gray-300 mb-4">The next generation with QUIC transport for improved performance</p>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>✓ QUIC protocol</li>
              <li>✓ Faster connection setup</li>
              <li>✓ Better packet loss resilience</li>
            </ul>
          </button>
        </div>
      </div>
    </div>
  );
}

interface WaterfallRequest {
  id: number;
  name: string;
  type: 'html' | 'css' | 'js' | 'image' | 'api';
  dns: number;
  tcp: number;
  ssl: number;
  request: number;
  wait: number;
  response: number;
  color: string;
  size: number;
}

interface PhaseStats {
  name: string;
  avgTime: number;
  minTime: number;
  maxTime: number;
  color: string;
}

function VisualizationPage({ protocol, onBack }: { protocol: 'http2' | 'http3'; onBack: () => void }) {
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<WaterfallRequest | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'html' | 'css' | 'js' | 'image' | 'api'>('all');
  const [metrics, setMetrics] = useState({
    latency: 0,
    multiplexingStreams: 0,
    headerCompression: 0,
    throughput: 0,
  });
  const [waterfallData, setWaterfallData] = useState<WaterfallRequest[]>([]);

  const generateWaterfallData = () => {
    const typeNames: Array<'html' | 'css' | 'js' | 'image' | 'api'> = ['html', 'css', 'js', 'image', 'api'];
    const typeIcons = { html: '📄', css: '🎨', js: '⚡', image: '🖼️', api: '🔗' };
    const typeColors = {
      html: '#3b82f6',
      css: '#06b6d4',
      js: '#10b981',
      image: '#f59e0b',
      api: '#ef4444',
    };
    const numRequests = protocol === 'http2' ? 8 : 12;
    const data: WaterfallRequest[] = [];

    for (let i = 0; i < numRequests; i++) {
      const type = typeNames[i % typeNames.length];
      data.push({
        id: i + 1,
        name: `${typeIcons[type]} ${type.toUpperCase()} ${i + 1}`,
        type,
        dns: protocol === 'http2' ? 25 : 10,
        tcp: protocol === 'http2' ? 50 : 15,
        ssl: protocol === 'http2' ? 35 : 20,
        request: 20,
        wait: 100 + Math.random() * 50,
        response: 50 + Math.random() * 30,
        color: typeColors[type],
        size: Math.floor(Math.random() * 500) + 50,
      });
    }

    return data;
  };

  const getPhaseStats = (data: WaterfallRequest[]): PhaseStats[] => {
    const phases = ['dns', 'tcp', 'ssl', 'request', 'wait', 'response'] as const;
    const phaseColors = {
      dns: '#ef4444',
      tcp: '#f97316',
      ssl: '#eab308',
      request: '#3b82f6',
      wait: '#06b6d4',
      response: '#10b981',
    };

    return phases.map((phase) => {
      const times = data.map((r) => r[phase]);
      return {
        name: phase.charAt(0).toUpperCase() + phase.slice(1),
        avgTime: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
        minTime: Math.min(...times),
        maxTime: Math.max(...times),
        color: phaseColors[phase],
      };
    });
  };

  const startSimulation = () => {
    setSimulationRunning(true);
    setWaterfallData(generateWaterfallData());
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setSimulationRunning(false);
      }

      const baseLatency = protocol === 'http2' ? 50 : 25;
      const baseStreams = protocol === 'http2' ? 6 : 12;
      const baseCompression = protocol === 'http2' ? 65 : 80;
      const baseThroughput = protocol === 'http2' ? 5.2 : 8.7;

      setMetrics({
        latency: Math.round(baseLatency * (1 - progress / 100)),
        multiplexingStreams: Math.round(baseStreams * (progress / 100)),
        headerCompression: Math.round(baseCompression * (progress / 100)),
        throughput: Math.round(baseThroughput * (progress / 100) * 10) / 10,
      });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Network className="w-8 h-8 text-blue-400" />
          <span className="text-2xl font-bold text-white">Protocol Racer</span>
        </div>
        <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {protocol === 'http2' ? 'HTTP/2' : 'HTTP/3'} Performance Visualization
          </h1>
          <p className="text-gray-400">Real-time simulation of protocol performance metrics</p>
        </div>

        <button
          onClick={startSimulation}
          disabled={simulationRunning}
          className="mb-8 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
        >
          {simulationRunning ? 'Simulation Running...' : 'Start Simulation'}
        </button>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <MetricCard
            title="Latency"
            value={`${metrics.latency}ms`}
            description="Connection latency - lower is better"
            icon={<BarChart3 className="w-8 h-8 text-yellow-400" />}
          />
          <MetricCard
            title="Multiplexing Streams"
            value={metrics.multiplexingStreams}
            description="Concurrent request streams"
            icon={<Zap className="w-8 h-8 text-blue-400" />}
          />
          <MetricCard
            title="Header Compression"
            value={`${metrics.headerCompression}%`}
            description="Compression efficiency ratio"
            icon={<BarChart3 className="w-8 h-8 text-green-400" />}
          />
          <MetricCard
            title="Throughput"
            value={`${metrics.throughput}Mbps`}
            description="Data transfer rate"
            icon={<Wifi className="w-8 h-8 text-cyan-400" />}
          />
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Live Chart</h2>
          <div className="h-64 flex items-end justify-around gap-2 p-4 bg-slate-900/50 rounded-lg">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t transition-all duration-300"
                style={{
                  height: `${(metrics.throughput / 10) * 100 * (0.5 + Math.sin(i + metrics.multiplexingStreams / 10) * 0.5)}%`,
                }}
              />
            ))}
          </div>
          <p className="text-gray-400 text-sm mt-4">Performance timeline visualization</p>
        </div>

        {waterfallData.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Network Waterfall</h2>
                <p className="text-sm text-gray-400">Click on a request to view detailed stats</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-3 py-2 rounded text-sm transition-all ${selectedFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedFilter('html')}
                  className={`px-3 py-2 rounded text-sm transition-all ${selectedFilter === 'html' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
                >
                  📄 HTML
                </button>
                <button
                  onClick={() => setSelectedFilter('css')}
                  className={`px-3 py-2 rounded text-sm transition-all ${selectedFilter === 'css' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
                >
                  🎨 CSS
                </button>
                <button
                  onClick={() => setSelectedFilter('js')}
                  className={`px-3 py-2 rounded text-sm transition-all ${selectedFilter === 'js' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
                >
                  ⚡ JS
                </button>
                <button
                  onClick={() => setSelectedFilter('image')}
                  className={`px-3 py-2 rounded text-sm transition-all ${selectedFilter === 'image' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
                >
                  🖼️ Image
                </button>
                <button
                  onClick={() => setSelectedFilter('api')}
                  className={`px-3 py-2 rounded text-sm transition-all ${selectedFilter === 'api' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
                >
                  🔗 API
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {waterfallData
                .filter((r) => selectedFilter === 'all' || r.type === selectedFilter)
                .map((request) => {
                  const totalTime =
                    request.dns + request.tcp + request.ssl + request.request + request.wait + request.response;
                  const maxTime = Math.max(...waterfallData.map((r) => r.dns + r.tcp + r.ssl + r.request + r.wait + r.response));
                  const isSelected = selectedRequest?.id === request.id;

                  return (
                    <div
                      key={request.id}
                      onClick={() => setSelectedRequest(isSelected ? null : request)}
                      className={`space-y-1 p-3 rounded-lg cursor-pointer transition-all ${isSelected ? 'bg-blue-500/20 border border-blue-500/50' : 'hover:bg-slate-700/50'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300 w-40">{request.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-gray-500">{request.size}KB</span>
                          <span className="text-xs font-semibold text-blue-300">{totalTime}ms</span>
                        </div>
                      </div>
                    <div className="flex items-center bg-slate-900/50 rounded-lg overflow-hidden h-8">
                      <div
                        className="bg-red-500/70 h-full flex items-center justify-center text-xs text-white font-semibold"
                        style={{ width: `${(request.dns / maxTime) * 100}%`, minWidth: '2px' }}
                        title={`DNS: ${request.dns}ms`}
                      >
                        {request.dns > 20 ? 'DNS' : ''}
                      </div>
                      <div
                        className="bg-orange-500/70 h-full flex items-center justify-center text-xs text-white font-semibold"
                        style={{ width: `${(request.tcp / maxTime) * 100}%`, minWidth: '2px' }}
                        title={`TCP: ${request.tcp}ms`}
                      >
                        {request.tcp > 20 ? 'TCP' : ''}
                      </div>
                      <div
                        className="bg-amber-500/70 h-full flex items-center justify-center text-xs text-white font-semibold"
                        style={{ width: `${(request.ssl / maxTime) * 100}%`, minWidth: '2px' }}
                        title={`SSL: ${request.ssl}ms`}
                      >
                        {request.ssl > 20 ? 'SSL' : ''}
                      </div>
                      <div
                        className="bg-blue-500/70 h-full flex items-center justify-center text-xs text-white font-semibold"
                        style={{ width: `${(request.request / maxTime) * 100}%`, minWidth: '2px' }}
                        title={`Request: ${request.request}ms`}
                      >
                        {request.request > 20 ? 'REQ' : ''}
                      </div>
                      <div
                        className="bg-cyan-500/50 h-full flex items-center justify-center text-xs text-white font-semibold"
                        style={{ width: `${(request.wait / maxTime) * 100}%`, minWidth: '2px' }}
                        title={`Wait: ${request.wait}ms`}
                      >
                        {request.wait > 30 ? 'Wait' : ''}
                      </div>
                      <div
                        className="bg-green-500/70 h-full flex items-center justify-center text-xs text-white font-semibold"
                        style={{ width: `${(request.response / maxTime) * 100}%`, minWidth: '2px' }}
                        title={`Response: ${request.response}ms`}
                      >
                        {request.response > 20 ? 'Res' : ''}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-slate-600 grid grid-cols-3 gap-3 text-xs">
                        <div className="bg-slate-900/50 p-2 rounded">
                          <p className="text-gray-500">DNS</p>
                          <p className="text-white font-semibold">{request.dns}ms</p>
                        </div>
                        <div className="bg-slate-900/50 p-2 rounded">
                          <p className="text-gray-500">TCP</p>
                          <p className="text-white font-semibold">{request.tcp}ms</p>
                        </div>
                        <div className="bg-slate-900/50 p-2 rounded">
                          <p className="text-gray-500">SSL</p>
                          <p className="text-white font-semibold">{request.ssl}ms</p>
                        </div>
                        <div className="bg-slate-900/50 p-2 rounded">
                          <p className="text-gray-500">Request</p>
                          <p className="text-white font-semibold">{request.request}ms</p>
                        </div>
                        <div className="bg-slate-900/50 p-2 rounded">
                          <p className="text-gray-500">Wait</p>
                          <p className="text-white font-semibold">{request.wait}ms</p>
                        </div>
                        <div className="bg-slate-900/50 p-2 rounded">
                          <p className="text-gray-500">Response</p>
                          <p className="text-white font-semibold">{request.response}ms</p>
                        </div>
                      </div>
                    )}
                    </div>
                  );
                })}
            </div>

            {selectedRequest && (
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-300 mb-3">Detailed Breakdown</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-gray-400">Total Time</p>
                    <p className="text-blue-300 font-bold">
                      {selectedRequest.dns + selectedRequest.tcp + selectedRequest.ssl + selectedRequest.request + selectedRequest.wait + selectedRequest.response}ms
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">File Size</p>
                    <p className="text-blue-300 font-bold">{selectedRequest.size}KB</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Request Type</p>
                    <p className="text-blue-300 font-bold">{selectedRequest.type.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 grid grid-cols-2 md:grid-cols-6 gap-4 pt-6 border-t border-slate-700">
              <div className="text-center">
                <div className="w-4 h-4 bg-red-500/70 rounded mx-auto mb-2"></div>
                <span className="text-xs text-gray-400">DNS</span>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-orange-500/70 rounded mx-auto mb-2"></div>
                <span className="text-xs text-gray-400">TCP</span>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-amber-500/70 rounded mx-auto mb-2"></div>
                <span className="text-xs text-gray-400">SSL</span>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-blue-500/70 rounded mx-auto mb-2"></div>
                <span className="text-xs text-gray-400">Request</span>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-cyan-500/50 rounded mx-auto mb-2"></div>
                <span className="text-xs text-gray-400">Wait</span>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-green-500/70 rounded mx-auto mb-2"></div>
                <span className="text-xs text-gray-400">Response</span>
              </div>
            </div>

            {waterfallData.length > 0 && (
              <div className="mt-8 p-6 bg-slate-900/50 rounded-lg border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Phase Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {getPhaseStats(waterfallData).map((stat) => (
                    <div key={stat.name} className="bg-slate-800/50 p-3 rounded-lg border border-slate-600">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: stat.color }}></div>
                        <span className="text-xs font-semibold text-gray-400">{stat.name}</span>
                      </div>
                      <p className="text-lg font-bold text-white">{stat.avgTime}ms</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {stat.minTime}ms - {stat.maxTime}ms
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/20 rounded-xl">
          <h3 className="text-xl font-bold text-white mb-3">{protocol === 'http2' ? 'HTTP/2' : 'HTTP/3'} Characteristics</h3>
          <ul className="text-gray-300 space-y-2">
            {protocol === 'http2' ? (
              <>
                <li>• Multiplexes multiple requests over a single TCP connection</li>
                <li>• Uses HPACK algorithm for header compression</li>
                <li>• Binary framing layer for efficient parsing</li>
                <li>• Server push capability for proactive content delivery</li>
              </>
            ) : (
              <>
                <li>• Built on QUIC transport protocol instead of TCP</li>
                <li>• Faster connection establishment with 0-RTT resumption</li>
                <li>• Better resilience to packet loss</li>
                <li>• Improved multiplexing with independent streams</li>
              </>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ title, value, description, icon }: { title: string; value: string | number; description: string; icon: React.ReactNode }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-400 text-sm mb-2">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        {icon}
      </div>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
}

export default App;
