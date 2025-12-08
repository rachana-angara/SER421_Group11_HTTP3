import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type ProtocolSlug = 'http2' | 'http3';

interface LabStep {
  id: string;
  text: string;
  playgroundPreset?: {
    protocol: ProtocolSlug;
    condition: '5g' | 'wifi' | 'slow3g';
  };
}

interface Lab {
  id: string;
  title: string;
  estMinutes: number;
  summary: string;
  goals: string[];
  steps: LabStep[];
}

const LABS: Lab[] = [
  {
    id: 'lab1',
    title: 'Lab 1 – Environment & Protocol Sanity Check',
    estMinutes: 15,
    summary: 'Verify that HTTP/1.1, HTTP/2, and HTTP/3 are all working locally and visible in DevTools.',
    goals: [
      'Confirm backend, frontend, and Caddy are running.',
      'Observe http/1.1, h2, and h3 in the browser Network panel.',
      'Use /api/protocol as an additional sanity check.'
    ],
    steps: [
      { id: 'l1-s1', text: 'Follow the Setup instructions to start the backend, build the frontend, and run Caddy.' },
      { id: 'l1-s2', text: 'Open DevTools → Network → enable the “Protocol” column.' },
      { id: 'l1-s3', text: 'Visit http1.localhost:8081, h2.localhost:8443, and h3.localhost:9443 and record the protocol used for several requests.' }
    ]
  },
  {
    id: 'lab2',
    title: 'Lab 2 – Comparing HTTP/2 and HTTP/3 Latency',
    estMinutes: 20,
    summary: 'Use the Playground simulation to compare latency of HTTP/2 versus HTTP/3 under the same network conditions.',
    goals: [
      'Run the same scenario over HTTP/2 and HTTP/3.',
      'Record latency for each protocol and condition.',
      'Relate differences back to Learn page concepts.'
    ],
    steps: [
      {
        id: 'l2-s1',
        text: 'Open the Playground preconfigured for HTTP/2 with a WiFi-like condition.',
        playgroundPreset: {
          protocol: 'http2',
          condition: 'wifi'
        }
      },
      {
        id: 'l2-s2',
        text: 'Repeat the experiment using HTTP/3 with the same WiFi-like condition.',
        playgroundPreset: {
          protocol: 'http3',
          condition: 'wifi'
        }
      },
      {
        id: 'l2-s3',
        text: 'Run both protocols again under a slow3g condition and record your observations.'
      }
    ]
  },
  {
    id: 'lab3',
    title: 'Lab 3 – Network Conditions and Throughput',
    estMinutes: 25,
    summary: 'Explore how simulated network conditions change latency and throughput and how that differs between HTTP/2 and HTTP/3.',
    goals: [
      'Run simulations under fast and slow network presets.',
      'Observe how latency and throughput metrics change.',
      'Compare the trends between protocols.'
    ],
    steps: [
      { id: 'l3-s1', text: 'In the Playground, choose either HTTP/2 or HTTP/3 and run simulations for 5G, WiFi, and Slow 3G.' },
      { id: 'l3-s2', text: 'Record latency and throughput for each condition.' },
      { id: 'l3-s3', text: 'Switch to the other protocol and repeat, then compare the results.' }
    ]
  },
  {
    id: 'lab4',
    title: 'Lab 4 – Protocol Tradeoffs & Analysis',
    estMinutes: 30,
    summary: 'Write a short analysis of when HTTP/3 is a meaningful improvement over HTTP/2, based on your measurements.',
    goals: [
      'Summarize findings from Labs 1–3.',
      'Discuss pros and cons of HTTP/2 and HTTP/3.',
      'Form an evidence-backed opinion about where each protocol is a good choice.'
    ],
    steps: [
      { id: 'l4-s1', text: 'Review your metrics, screenshots, and notes from Labs 1–3.' },
      { id: 'l4-s2', text: 'Write a one to two page reflection comparing HTTP/2 and HTTP/3 using your data as evidence.' }
    ]
  }
];

function Labs() {
  const [selectedLabId, setSelectedLabId] = useState<string>(LABS[0]?.id ?? '');
  const navigate = useNavigate();

  const selectedLab = LABS.find(l => l.id === selectedLabId);

  const handleOpenInPlayground = (step: LabStep) => {
    if (!step.playgroundPreset) return;

    const { protocol, condition } = step.playgroundPreset;

    navigate({
      pathname: '/playground',
      search: `?lab=${selectedLab?.id}&protocol=${protocol}&condition=${condition}`
    });
  };

  return (
    <div className="container mx-auto px-6 py-12 text-gray-200 flex flex-col md:flex-row gap-8">
      {/* Left column: lab list */}
      <aside className="md:w-1/3 space-y-4">
        <h1 className="text-3xl font-bold text-white mb-2">Labs</h1>
        <p className="text-sm text-gray-300 mb-4">
          Guided experiments that connect the Learn page concepts to hands-on measurements in the Playground.
        </p>
        <div className="space-y-2">
          {LABS.map(lab => (
            <button
              key={lab.id}
              onClick={() => setSelectedLabId(lab.id)}
              className={`w-full text-left p-3 rounded-lg border ${
                lab.id === selectedLabId
                  ? 'border-blue-500 bg-slate-800'
                  : 'border-slate-800 bg-slate-900 hover:border-slate-700'
              }`}
            >
              <h2 className="text-sm font-semibold text-white">{lab.title}</h2>
              <p className="text-xs text-gray-400 mt-1">{lab.summary}</p>
              <p className="text-[11px] text-gray-500 mt-1">Estimated time: {lab.estMinutes} minutes</p>
            </button>
          ))}
        </div>
      </aside>

      {/* Right column: lab detail */}
      <section className="flex-1 bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
        {selectedLab && (
          <>
            <h1 className="text-2xl font-bold text-white">{selectedLab.title}</h1>
            <p className="text-gray-300 text-sm">{selectedLab.summary}</p>

            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Goals</h2>
              <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                {selectedLab.goals.map(goal => (
                  <li key={goal}>{goal}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Steps</h2>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-200">
                {selectedLab.steps.map(step => (
                  <li key={step.id}>
                    <div className="flex flex-col gap-1">
                      <span>{step.text}</span>
                      {step.playgroundPreset && (
                        <button
                          onClick={() => handleOpenInPlayground(step)}
                          className="self-start mt-1 px-3 py-1 rounded text-xs font-semibold bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Open scenario in Playground
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <p className="text-[11px] text-gray-500 italic">
              Detailed expected results and grading criteria are described in docs/labs-spec.md and in the project report.
            </p>
          </>
        )}
      </section>
    </div>
  );
}

export default Labs;
