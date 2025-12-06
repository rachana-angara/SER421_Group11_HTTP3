import { Zap, Network, BarChart3, Wifi, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { callHealth } from '../utils/apiClient';
import { NetworkCondition } from '../types';
import { ProtocolSelectModal } from '../components/ProtocolSelectModal';
import { NetworkConditionSimulator } from '../components/NetworkConditionSimulator';
import { VisualizationPage } from '../components/VisualizationPage';

function Playground() {
  const [view, setView] = useState<'home' | 'protocol-select' | 'network-select' | 'visualization'>('home');
  const [backendError, setBackendError] = useState<string | null>(null);
  const [selectedProtocol, setSelectedProtocol] = useState<'http2' | 'http3' | null>(null);
  const [networkCondition, setNetworkCondition] = useState<NetworkCondition>({
    latency: 20,
    bandwidth: 10,
    packetLoss: 0,
    name: '5G',
  });

  useEffect(() => {
    callHealth()
      .then((res) => {
        console.log('backend health from React:', res);
        setBackendError(null); 
      })
      .catch((err) => {
        console.error('health call failed:', err);
        setBackendError(err?.message ?? 'Backend unavailable. Please try again.');
      });
  }, []);

  const handleProtocolSelect = (protocol: 'http2' | 'http3') => {
    setSelectedProtocol(protocol);
    setView('network-select');
  };

  const handleNetworkSelect = (condition: NetworkCondition) => {
    setNetworkCondition(condition);
    setView('visualization');
  };

  const handleBackToHome = () => {
    setView('home');
    setSelectedProtocol(null);
    setNetworkCondition({ latency: 20, bandwidth: 10, packetLoss: 0, name: '5G' });
  };

  if (view === 'visualization' && selectedProtocol) {
    return <VisualizationPage protocol={selectedProtocol} networkCondition={networkCondition} onBack={handleBackToHome} />;
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
        {backendError && (
          <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
            Backend error: {backendError}
          </div>
        )}
        <div className="text-center mb-20">
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setView('protocol-select')}
              className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
            >
              <span>Start Comparison</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {view === 'protocol-select' && (
            <ProtocolSelectModal onSelect={handleProtocolSelect} onClose={handleBackToHome} />
          )}

          {view === 'network-select' && selectedProtocol && (
            <NetworkConditionSimulator
              protocol={selectedProtocol}
              onSelect={handleNetworkSelect}
              onBack={() => {
                setView('protocol-select');
              }}
            />
          )}
        </div>

      </main>

      <footer className="container mx-auto px-6 py-12 text-center text-gray-400 border-t border-gray-800 mt-20">
        <p>Built to demonstrate the power of modern web transport protocols</p>
      </footer>
    </div>
  );
}

export default Playground;
