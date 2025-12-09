import React from "react";
import { Zap, BarChart3, Wifi, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { NetworkCondition } from '../types';

export default function Home() {

  const navigate = useNavigate();
  const [networkCondition, setNetworkCondition] = useState<NetworkCondition>({
    latency: 20,
    bandwidth: 10,
    packetLoss: 0,
    name: '5G',
  });

  return (
    <div className="min-h-[calc(100vh-140px)] bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <main className="container mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Experience the
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}
              Speed Revolution
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Compare HTTP/2 and HTTP/3 performance in real-time. Visualize
            multiplexing, header compression, and latency effects through
            interactive charts and live network simulations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
           
            <button
              onClick={() => navigate("/learn")}
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white text-lg font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Start Tutorial
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <FeatureCard
            title="Real-Time Performance"
            description="Watch protocols race side-by-side with live metrics showing speed, latency, and throughput differences."
          />
          <FeatureCard
            title="Interactive Charts"
            description="Visualize multiplexing streams, header compression ratios, and connection efficiency through dynamic animations."
          />
          <FeatureCard
            title="Network Simulation"
            description="Simulate various network conditions including packet loss, high latency, and bandwidth throttling."
          />
        </div>

        <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 sm:p-10 space-y-4">
          <h2 className="text-3xl font-bold text-white mb-2">
            How to use this tutorial
          </h2>
          <p className="text-gray-300 max-w-3xl">
            The site is organized so that you first learn the concepts, then run
            experiments, and finally complete graded-style labs.
          </p>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>
              Go to <span className="font-semibold">Learn</span> to understand
              HTTP/1.1 problems and how HTTP/2 and HTTP/3 fix them.
            </li>
            <li>
              Open <span className="font-semibold">Playground</span> to try
              different scenarios (number of files, sizes, protocols).
            </li>
            <li>
              Use <span className="font-semibold">Labs</span> as guided
              activities that tell you what to measure and what to conclude.
            </li>
            <li>
              Check <span className="font-semibold">Setup</span> if you need to
              run the backend and proxy stack on your own machine.
            </li>
          </ol>
        </section>
      </main>
    </div>
  );
}

function FeatureCard(props: {
  title: string;
  description: string;
}) {
  const { title, description } = props;
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-1">
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
