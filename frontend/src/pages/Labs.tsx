export default function Labs() {
  return (
    <div className="container mx-auto px-6 py-12 text-gray-200 space-y-6">
      <h1 className="text-4xl font-bold text-white mb-2">Labs (Draft)</h1>
      <p className="text-lg text-gray-300 max-w-3xl">
        The final project will include guided lab activities that connect the
        Learn page to hands-on measurements in the Playground. Below are the
        labs we plan to implement.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <LabCard
          title="Lab 1 – HTTP/1.1 Waterfall"
          text="TODO: instructions to load a resource-heavy page over HTTP/1.1 and inspect the waterfall in DevTools."
        />
        <LabCard
          title="Lab 2 – HTTP/2 Multiplexing"
          text="TODO: compare HTTP/1.1 versus HTTP/2 using our Playground and explain why the waterfall changes."
        />
        <LabCard
          title="Lab 3 – HTTP/3 & QUIC"
          text="TODO: observe how HTTP/3 behaves under packet loss and high latency scenarios."
        />
        <LabCard
          title="Lab 4 – Protocol Trade-offs"
          text="TODO: have students summarize when each protocol is a good choice and justify with measurements."
        />
      </div>

      <p className="text-xs text-gray-400 italic">
        Detailed step-by-step instructions, screenshots, and reflection
        questions will be added in the next project milestone.
      </p>
    </div>
  );
}

function LabCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-2">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="text-gray-300 text-sm">{text}</p>
    </div>
  );
}
