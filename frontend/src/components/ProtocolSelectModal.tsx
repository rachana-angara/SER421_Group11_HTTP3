import { X } from 'lucide-react';

export function ProtocolSelectModal({
  onSelect,
  onClose,
}: {
  onSelect: (protocol: 'http2' | 'http3') => void;
  onClose: () => void;
}) {
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
