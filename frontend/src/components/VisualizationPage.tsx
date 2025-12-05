import { useState } from 'react';
import { Zap, Network, BarChart3, Wifi, X } from 'lucide-react';
import { NetworkCondition, WaterfallRequest, Metrics, PhaseStats } from '../types';
import { generateWaterfallData, getPhaseStats } from '../utils/waterfallUtils';
import { MetricCard } from './MetricCard';

interface Props {
  protocol: 'http2' | 'http3';
  networkCondition: NetworkCondition;
  onBack: () => void;
}

export function VisualizationPage({ protocol, networkCondition, onBack }: Props) {
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<WaterfallRequest | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'html' | 'css' | 'js' | 'image' | 'api'>('all');
  const [metrics, setMetrics] = useState<Metrics>({
    latency: 0,
    multiplexingStreams: 0,
    headerCompression: 0,
    throughput: 0,
  });
  const [waterfallData, setWaterfallData] = useState<WaterfallRequest[]>([]);

  const startSimulation = () => {
    setSimulationRunning(true);
    setWaterfallData(generateWaterfallData(protocol, networkCondition));
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

      const networkLatencyFactor = 1 + networkCondition.latency / 200;

      setMetrics({
        latency: Math.round(baseLatency * networkLatencyFactor * (1 - progress / 100)),
        multiplexingStreams: Math.round(baseStreams * (progress / 100)),
        headerCompression: Math.round(baseCompression * (progress / 100)),
        throughput: Math.round((baseThroughput * (progress / 100) * (networkCondition.bandwidth / 10)) * 10) / 10,
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {protocol === 'http2' ? 'HTTP/2' : 'HTTP/3'} Performance Visualization
              </h1>
              <p className="text-gray-400">Real-time simulation of protocol performance metrics</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4 min-w-48">
              <p className="text-xs text-gray-400 mb-2">Network Condition</p>
              <p className="text-2xl font-bold text-white">{networkCondition.name}</p>
              <div className="mt-3 space-y-1 text-xs">
                <p className="text-gray-300">
                  <span className="text-gray-500">Latency:</span> {networkCondition.latency}ms
                </p>
                <p className="text-gray-300">
                  <span className="text-gray-500">Bandwidth:</span> {networkCondition.bandwidth} Mbps
                </p>
                <p className="text-gray-300">
                  <span className="text-gray-500">Packet Loss:</span> {networkCondition.packetLoss}%
                </p>
              </div>
            </div>
          </div>
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
                  const totalTime = request.dns + request.tcp + request.ssl + request.request + request.wait + request.response;
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
