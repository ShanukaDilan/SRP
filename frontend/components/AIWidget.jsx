import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

async function callGemini(prompt) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
    if (!apiKey) return 'Standard traffic across sectors. No action required.';
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Systems nominal.';
  } catch {
    return 'Systems nominal.';
  }
}

export default function AIWidget({ user }) {
  const [brief, setBrief] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const name = user?.name || 'Operator';
    const prompt = `Generate a short technical Operational Briefing for ${name}. Keep it one sentence; mention nodes, sectors, anomalies.`;
    const text = await callGemini(prompt);
    setBrief(text);
    setLoading(false);
  };

  // Only load on idle to improve first paint; or when user clicks Refresh
  useEffect(() => {
    const auto = process.env.NEXT_PUBLIC_GEMINI_AUTO === '1';
    if (!auto) return; // disabled by default
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => load());
    } else {
      setTimeout(() => load(), 300);
    }
  }, []);

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-slate-200 font-semibold">AI Operational Briefing</h3>
        <button onClick={load} disabled={loading} className="text-xs px-2 py-1 rounded border border-slate-700 text-slate-200 hover:bg-slate-800 disabled:opacity-60 flex items-center gap-1">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>
      <p className="text-slate-300 text-sm font-mono min-h-[1.25rem]">{brief || 'Ready.'}</p>
    </div>
  );
}
