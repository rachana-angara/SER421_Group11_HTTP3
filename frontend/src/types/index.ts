export interface NetworkCondition {
  latency: number;
  bandwidth: number;
  packetLoss: number;
  name: string;
}

export interface WaterfallRequest {
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

export interface PhaseStats {
  name: string;
  avgTime: number;
  minTime: number;
  maxTime: number;
  color: string;
}

export interface Metrics {
  latency: number;
  multiplexingStreams: number;
  headerCompression: number;
  throughput: number;
}
