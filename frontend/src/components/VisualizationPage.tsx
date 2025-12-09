
import { useState } from 'react';
import { Zap, Network, BarChart3, Wifi, X, Settings } from 'lucide-react';
import { NetworkCondition, WaterfallRequest, Metrics, PhaseStats } from '../types';
import { generateWaterfallData, getPhaseStats } from '../utils/waterfallUtils';
import { MetricCard } from './MetricCard';
import { runFastSimulation } from '../utils/simulationService';
import { NetworkConditionSimulator } from './NetworkConditionSimulator';

interface Props {
  protocol: 'http2' | 'http3';
  networkCondition: NetworkCondition;
  onBack: () => void;
}

export function VisualizationPage({ protocol, networkCondition, onBack }: Props) {
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<WaterfallRequest | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'html' | 'css' | 'js' | 'image' | 'api'>('all');
  const [showNetworkSettings, setShowNetworkSettings] = useState(false);
  const [currentNetworkCondition, setCurrentNetworkCondition] = useState<NetworkCondition>(networkCondition);
  const [metrics, setMetrics] = useState<Metrics>({
    latency: 0,
    multiplexingStreams: 0,
    headerCompression: 0,
    throughput: 0,
  });
  const [waterfallData, setWaterfallData] = useState<WaterfallRequest[]>([]);
  const [phaseStats, setPhaseStats] = useState<PhaseStats[]>([]);

  const startSimulation = async (condition: NetworkCondition = currentNetworkCondition) => {
    setSimulationRunning(true);
    try {
      // 1) Ask backend to run the fast simulation
      const result = await runFastSimulation(protocol, condition);
      console.log('simulation result from backend:', result);

      // 2) Update the 4 metric cards using backend + UI data
      setMetrics({
        latency: Math.round(result.latencyMs),
        throughput: condition.bandwidth,
        multiplexingStreams: protocol === 'http2' ? 6 : 8,
        headerCompression: protocol === 'http2' ? 30 : 45,
      });

      // 3) Drive the waterfall chart
      const waterfall = generateWaterfallData(protocol, condition);
      setWaterfallData(waterfall);
      setPhaseStats(getPhaseStats(waterfall));
      console.log('waterfall data from backend latency:', waterfall);
    } catch (error) {
      console.error('Error running simulation', error);
    } finally {
      setSimulationRunning(false);
    }
  };

  const handleNetworkConditionChange = (condition: NetworkCondition) => {
    setCurrentNetworkCondition(condition);
    setShowNetworkSettings(false);
    startSimulation(condition);
  };

  const handleStartSimulation = () => {
    console.log('Starting backend fast simulation...');
    startSimulation();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Performance Visualization</h1>
            <p className="text-gray-400">Real-time simulation of protocol performance metrics</p>
          </div>
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Wifi className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-white font-semibold">{currentNetworkCondition.name}</p>
                <p className="text-gray-400 text-sm">
                  Latency: {currentNetworkCondition.latency}ms • Bandwidth: {currentNetworkCondition.bandwidth} Mbps • Packet Loss: {currentNetworkCondition.packetLoss}%
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNetworkSettings(true)}
              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg text-blue-300 transition-all flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm font-semibold">Change Network</span>
            </button>
          </div>

          <button
            onClick={handleStartSimulation}
            disabled={simulationRunning}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 rounded-lg font-semibold text-lg transition-all shadow-lg"
          >
            {simulationRunning ? 'Simulation Running...' : 'Start Simulation'}
          </button>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricCard
              title="Latency"
              value={metrics.latency}
              description="ms"
            />
            <MetricCard
              title="Multiplexing"
              value={metrics.multiplexingStreams}
              description="streams"
            />
            <MetricCard
              title="Compression"
              value={metrics.headerCompression}
              description="%"
            />
            <MetricCard
              title="Throughput"
              value={metrics.throughput}
              description="Mbps"
            />
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Live Chart</h3>
            <div className="h-32 bg-slate-900/50 rounded-lg flex items-end gap-1 p-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-blue-500 to-purple-600 rounded-t opacity-60"
                  style={{ height: `${Math.random() * 100}%` }}
                />
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-2">Performance timeline visualization</p>
          </div>

          {waterfallData.length > 0 && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Network Waterfall</h3>
                  <p className="text-gray-400 text-sm">Click on a request to view detailed stats</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedFilter('all')}
                    className={`px-3 py-2 rounded text-sm transition-all ${
                      selectedFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setSelectedFilter('html')}
                    className={`px-3 py-2 rounded text-sm transition-all ${
                      selectedFilter === 'html' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    HTML
                  </button>
                  <button
                    onClick={() => setSelectedFilter('css')}
                    className={`px-3 py-2 rounded text-sm transition-all ${
                      selectedFilter === 'css' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    CSS
                  </button>
                  <button
                    onClick={() => setSelectedFilter('js')}
                    className={`px-3 py-2 rounded text-sm transition-all ${
                      selectedFilter === 'js' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    JS
                  </button>
                  <button
                    onClick={() => setSelectedFilter('image')}
                    className={`px-3 py-2 rounded text-sm transition-all ${
                      selectedFilter === 'image' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    Image
                  </button>
                  <button
                    onClick={() => setSelectedFilter('api')}
                    className={`px-3 py-2 rounded text-sm transition-all ${
                      selectedFilter === 'api' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    API
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {waterfallData
                  .filter((r) => selectedFilter === 'all' || r.type === selectedFilter)
                  .map((request) => {
                    const totalTime = request.dns + request.tcp + request.ssl + request.request + request.wait + request.response;
                    const maxTime = Math.max(...waterfallData.map((r) => r.dns + r.tcp + r.ssl + r.request + r.wait + r.response));
                    const isSelected = selectedRequest?.id === request.id;

                    return (
                      <div key={request.id}>
                        <div
                          onClick={() => setSelectedRequest(isSelected ? null : request)}
                          className={`space-y-1 p-3 rounded-lg cursor-pointer transition-all ${
                            isSelected ? 'bg-blue-500/20 border border-blue-500/50' : 'hover:bg-slate-700/50'
                          }`}
                        >
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-white font-semibold">{request.name}</span>
                            <span className="text-gray-400">
                              {request.size}KB • {totalTime}ms
                            </span>
                          </div>
                          <div className="flex gap-0.5 h-6 bg-slate-900/50 rounded overflow-hidden">
                            <div
                              className="bg-yellow-500 flex items-center justify-center text-xs text-white font-semibold"
                              style={{ width: `${(request.dns / maxTime) * 100}%` }}
                            >
                              {request.dns > 20 ? 'DNS' : ''}
                            </div>
                            <div
                              className="bg-orange-500 flex items-center justify-center text-xs text-white font-semibold"
                              style={{ width: `${(request.tcp / maxTime) * 100}%` }}
                            >
                              {request.tcp > 20 ? 'TCP' : ''}
                            </div>
                            <div
                              className="bg-purple-500 flex items-center justify-center text-xs text-white font-semibold"
                              style={{ width: `${(request.ssl / maxTime) * 100}%` }}
                            >
                              {request.ssl > 20 ? 'SSL' : ''}
                            </div>
                            <div
                              className="bg-blue-500 flex items-center justify-center text-xs text-white font-semibold"
                              style={{ width: `${(request.request / maxTime) * 100}%` }}
                            >
                              {request.request > 20 ? 'REQ' : ''}
                            </div>
                            <div
                              className="bg-green-500 flex items-center justify-center text-xs text-white font-semibold"
                              style={{ width: `${(request.wait / maxTime) * 100}%` }}
                            >
                              {request.wait > 30 ? 'Wait' : ''}
                            </div>
                            <div
                              className="bg-cyan-500 flex items-center justify-center text-xs text-white font-semibold"
                              style={{ width: `${(request.response / maxTime) * 100}%` }}
                            >
                              {request.response > 20 ? 'Res' : ''}
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="ml-4 mt-2 p-4 bg-slate-900/50 rounded-lg border border-slate-700 grid grid-cols-3 md:grid-cols-6 gap-3">
                            <div>
                              <p className="text-xs text-gray-400">DNS</p>
                              <p className="text-white font-semibold">{request.dns}ms</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">TCP</p>
                              <p className="text-white font-semibold">{request.tcp}ms</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">SSL</p>
                              <p className="text-white font-semibold">{request.ssl}ms</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Request</p>
                              <p className="text-white font-semibold">{request.request}ms</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Wait</p>
                              <p className="text-white font-semibold">{request.wait}ms</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Response</p>
                              <p className="text-white font-semibold">{request.response}ms</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>

              {selectedRequest && (
                <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                  <h4 className="text-lg font-semibold mb-3">Detailed Breakdown</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Total Time</p>
                      <p className="text-white font-semibold text-lg">
                        {selectedRequest.dns +
                          selectedRequest.tcp +
                          selectedRequest.ssl +
                          selectedRequest.request +
                          selectedRequest.wait +
                          selectedRequest.response}
                        ms
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">File Size</p>
                      <p className="text-white font-semibold text-lg">{selectedRequest.size}KB</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Request Type</p>
                      <p className="text-white font-semibold text-lg">{selectedRequest.type.toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 flex gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span className="text-gray-400">DNS</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span className="text-gray-400">TCP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span className="text-gray-400">SSL</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-gray-400">Request</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-400">Wait</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-cyan-500 rounded"></div>
                  <span className="text-gray-400">Response</span>
                </div>
              </div>

              {waterfallData.length > 0 && (
                <div className="mt-6 bg-slate-900/50 rounded-lg border border-slate-700 p-4">
                  <h4 className="text-lg font-semibold mb-3">Phase Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                    {getPhaseStats(waterfallData).map((stat) => (
                      <div key={stat.name} className="text-center">
                        <p className="text-xs text-gray-400 mb-1">{stat.name}</p>
                        <p className="text-white font-bold text-lg">{stat.avgTime}ms</p>
                        <p className="text-xs text-gray-500">
                          {stat.minTime}ms - {stat.maxTime}ms
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">
               Characteristics
            </h3>
            {protocol === 'http2' ? (
              <ul className="space-y-2 text-gray-300">
                <li>• Multiplexes multiple requests over a single TCP connection</li>
                <li>• Uses HPACK algorithm for header compression</li>
                <li>• Binary framing layer for efficient parsing</li>
                <li>• Server push capability for proactive content delivery</li>
              </ul>
            ) : (
              <ul className="space-y-2 text-gray-300">
                <li>• Built on QUIC transport protocol instead of TCP</li>
                <li>• Faster connection establishment with 0-RTT resumption</li>
                <li>• Better resilience to packet loss</li>
                <li>• Improved multiplexing with independent streams</li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {showNetworkSettings && (
        <NetworkConditionSimulator
          protocol={protocol}
          onSelect={handleNetworkConditionChange}
          onBack={() => setShowNetworkSettings(false)}
        />
      )}
    </div>
  );
}