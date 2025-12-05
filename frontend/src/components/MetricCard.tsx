interface Props {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}

export function MetricCard({ title, value, description, icon }: Props) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-400 text-sm mb-2">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        {icon}
      </div>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
}
