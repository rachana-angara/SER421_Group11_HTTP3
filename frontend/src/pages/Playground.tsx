import { Zap, Network, BarChart3, Wifi, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { callHealth } from '../utils/apiClient';
import { NetworkCondition } from '../types';
import { VisualizationPage } from '../components/VisualizationPage';

const CONDITION_PRESETS: Record<string, NetworkCondition> = {
  '5g': { name: '5G', latency: 20, bandwidth: 50, packetLoss: 0 },
  'wifi': { name: 'WiFi', latency: 30, bandwidth: 30, packetLoss: 0.5 },
  'slow3g': { name: 'Slow 3G', latency: 100, bandwidth: 1, packetLoss: 3 }
};

const ORIGIN_MAP: Record<'http1' | 'http2' | 'http3', string> = {
  http1: 'http://http1.localhost:8081',
  http2: 'https://h2.localhost:8443',
  http3: 'https://h3.localhost:9443'
};

function switchOrigin(
  target: keyof typeof ORIGIN_MAP) {
  const { pathname, search, hash } = window.location;
  window.location.href = ORIGIN_MAP[target] + pathname + search + hash;
}


function Playground() {
  const [view, setView] = useState<'home' | 'protocol-select' | 'network-select' | 'visualization'>('home');
  const [backendError, setBackendError] = useState<string | null>(null);
  const [selectedProtocol, setSelectedProtocol] = useState<'http1'| 'http2' | 'http3' | null>(null);
  const [networkCondition, setNetworkCondition] = useState<NetworkCondition>({
    latency: 20,
    bandwidth: 10,
    packetLoss: 0,
    name: '5G'
  });

  const location = useLocation();

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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const protocolParam = params.get('protocol');
    const conditionParam = params.get('condition');

    if (protocolParam === 'http2' || protocolParam === 'http3') {
      setSelectedProtocol(protocolParam);

      if (conditionParam) {
        const preset = CONDITION_PRESETS[conditionParam.toLowerCase()];
        if (preset) {
          setNetworkCondition(preset);
        }
      }

      setView('visualization');
    }
  }, [location.search]);


  const handleBackToHome = () => {
    setView('home');
    setSelectedProtocol(null);
    setNetworkCondition({
      latency: 20,
      bandwidth: 10,
      packetLoss: 0,
      name: '5G'
    });
  };

  if (view === 'visualization') {
    return (
      <VisualizationPage
        protocol={'http2'}
        networkCondition={networkCondition}
        onBack={handleBackToHome}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      

      <main className="container mx-auto px-6 py-20">
        {backendError && (
          <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
            Backend error: {backendError}
          </div>
        )}

        <div className="mb-10 flex flex-col items-center gap-2 text-sm">
          <span className="text-gray-300">
            Currently loaded from:{' '}
            <code className="bg-slate-800 px-2 py-1 rounded">
              {typeof window !== 'undefined' ? window.location.origin : ''}
            </code>
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => {switchOrigin('http1');
                  setSelectedProtocol('http1');  
              }}
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-gray-200 border border-slate-600"
            >
              Open HTTP/1.1 origin
            </button>
            <button
              onClick={() => {
  switchOrigin('http2');
  setSelectedProtocol('http2');  
}}

              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-gray-200 border border-slate-600"
            >
              Open HTTP/2 origin
            </button>
            <button
              onClick={() => {
                 switchOrigin('http3',)
                 setSelectedProtocol('http3');
                }
              }
              className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-gray-200 border border-slate-600"
            >
              Open HTTP/3 origin
            </button>
          </div>
        </div>

        <div className="text-center mb-20">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setView('visualization')}
              className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
            >
              <span>Start Comparison</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        
        </div>
      </main>

      <footer className="container mx-auto px-6 py-12 text-center text-gray-400 border-t border-gray-800 mt-20">
        <p>Built to demonstrate the power of modern web transport protocols</p>
      </footer>
    </div>
  );
}

export default Playground;
