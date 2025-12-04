import { WaterfallRequest, PhaseStats, NetworkCondition } from '../types';

export const generateWaterfallData = (
  protocol: 'http2' | 'http3',
  networkCondition: NetworkCondition
): WaterfallRequest[] => {
  const latencyMultiplier = 1 + networkCondition.latency / 100;
  const packetLossImpact = 1 + networkCondition.packetLoss / 50;

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
    const dnsBase = protocol === 'http2' ? 25 : 10;
    const tcpBase = protocol === 'http2' ? 50 : 15;
    const sslBase = protocol === 'http2' ? 35 : 20;

    data.push({
      id: i + 1,
      name: `${typeIcons[type]} ${type.toUpperCase()} ${i + 1}`,
      type,
      dns: Math.round(dnsBase * latencyMultiplier * packetLossImpact),
      tcp: Math.round(tcpBase * latencyMultiplier * packetLossImpact),
      ssl: Math.round(sslBase * latencyMultiplier * packetLossImpact),
      request: Math.round(20 * latencyMultiplier),
      wait: Math.round((100 + Math.random() * 50) * latencyMultiplier),
      response: Math.round((50 + Math.random() * 30) / (networkCondition.bandwidth / 10)),
      color: typeColors[type],
      size: Math.floor(Math.random() * 500) + 50,
    });
  }

  return data;
};

export const getPhaseStats = (data: WaterfallRequest[]): PhaseStats[] => {
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
