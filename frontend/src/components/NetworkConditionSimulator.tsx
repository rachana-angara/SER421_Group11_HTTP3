import { X, Gauge } from 'lucide-react';
import { useState } from 'react';
import { NetworkCondition } from '../types';

interface Props {
  protocol: 'http2' | 'http3';
  onSelect: (condition: NetworkCondition) => void;
  onBack: () => void;
}

export function NetworkConditionSimulator({ protocol, onSelect, onBack }: Props) {
  const [latency, setLatency] = useState(20);
  const [bandwidth, setBandwidth] = useState(10);
  const [packetLoss, setPacketLoss] = useState(0);
  const [customMode, setCustomMode] = useState(false);

  const presets: Array<{ name: string; condition: NetworkCondition; icon: string }> = [
    {
      name: '5G',
      condition: { name: '5G', latency: 20, bandwidth: 50, packetLoss: 0 },
      icon: '⚡',
    },
    {
      name: '4G',
      condition: { name: '4G', latency: 50, bandwidth: 10, packetLoss: 1 },
      icon: '📱',
    },
    {
      name: 'WiFi',
      condition: { name: 'WiFi', latency: 30, bandwidth: 30, packetLoss: 0.5 },
      icon: '📶',
    },
    {
      name: 'Slow 3G',
      condition: { name: 'Slow 3G', latency: 100, bandwidth: 1, packetLoss: 3 },
      icon: '🐌',
    },
    {
      name: 'Fiber',
      condition: { name: 'Fiber', latency: 10, bandwidth: 100, packetLoss: 0 },
      icon: '🔥',
    },
  ];

  const handlePreset = (condition: NetworkCondition) => {
    onSelect(condition);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full border border-slate-700 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white">Network Conditions</h2>
            <p className="text-gray-400 text-sm mt-1">Select {protocol.toUpperCase()} performance under different network conditions</p>
          </div>
          <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handlePreset(preset.condition)}
                className="group p-4 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 hover:border-blue-500/50 rounded-lg transition-all duration-300 text-center"
              >
                <div className="text-2xl mb-2">{preset.icon}</div>
                <p className="text-white font-semibold text-sm group-hover:text-blue-300 transition-colors">{preset.name}</p>
              </button>
            ))}
          </div>

          <div className="border-t border-slate-600 pt-6">
            <button
              onClick={() => setCustomMode(!customMode)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg text-blue-300 transition-all mb-4"
            >
              <Gauge className="w-4 h-4" />
              <span className="font-semibold text-sm">{customMode ? 'Hide' : 'Show'} Custom Settings</span>
            </button>

            {customMode && (
              <div className="space-y-4 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Latency: {latency}ms</label>
                  <input
                    type="range"
                    min="10"
                    max="300"
                    value={latency}
                    onChange={(e) => setLatency(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Adds network delay to all requests</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Bandwidth: {bandwidth} Mbps</label>
                  <input
                    type="range"
                    min="0.5"
                    max="100"
                    step="0.5"
                    value={bandwidth}
                    onChange={(e) => setBandwidth(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Affects download speed of responses</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Packet Loss: {packetLoss}%</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={packetLoss}
                    onChange={(e) => setPacketLoss(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Simulates unreliable network conditions</p>
                </div>

                <button
                  onClick={() =>
                    handlePreset({
                      name: 'Custom',
                      latency,
                      bandwidth,
                      packetLoss,
                    })
                  }
                  className="w-full mt-4 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all"
                >
                  Simulate with Custom Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
