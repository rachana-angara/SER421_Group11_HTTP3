import type { NetworkCondition } from '../types';

const API_BASE = '/api';

// ---------- Health check ----------

export async function callHealth() {
  const response = await fetch(`${API_BASE}/health`);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Health check failed: ${response.status} ${response.statusText} - ${text}`,
    );
  }

  return (await response.json()) as { status: string };
}

// ---------- Simulation (fast API) ----------

export interface BackendSimulationResponse {
  protocol: string;
  configuredDelayMs: number;
  measuredLatencyMs?: number;
  id: number | null;
  type: string;
  timestamp: string;
}

export interface SimulationResult {
  endpointType: 'fast' | 'slow';
  latencyMs: number;
  timestamp: string;
  protocol: 'http2' | 'http3';
}

export async function runFastSimulation(
  protocol: 'http2' | 'http3',
  _networkCondition: NetworkCondition, 
  id?: number,
): Promise<SimulationResult> {
  const params = new URLSearchParams();
  params.append('protocol', protocol);

  if (id != null) {
    params.append('id', String(id));
  }

  const url = `${API_BASE}/resource/api/fast?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Fast API failed: ${response.status} ${response.statusText} - ${text}`,
    );
  }

  const data = (await response.json()) as BackendSimulationResponse;

  const latencyMs =
    data.measuredLatencyMs ?? data.configuredDelayMs ?? 0;

  return {
    endpointType: 'fast',
    latencyMs,
    timestamp: data.timestamp,
    protocol,
  };
}
