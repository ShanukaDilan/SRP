export default function StatCard({ title, value, color = 'blue' }) {
  const pct = Math.max(0, Math.min(100, value));
  const colorCls = color === 'red' ? 'bg-red-500' : color === 'green' ? 'bg-emerald-500' : 'bg-blue-500';
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
      <div className="text-slate-300 text-sm mb-2">{title}</div>
      <div className="text-slate-100 text-xl font-semibold mb-2">{pct}%</div>
      <div className="h-2 w-full bg-slate-800 rounded">
        <div className={`h-2 ${colorCls} rounded`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

