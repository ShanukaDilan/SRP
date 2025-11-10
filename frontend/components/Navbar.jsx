import { ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/router';
import { logout } from '../src/lib/api';

export default function Navbar({ user }) {
  const router = useRouter();
  const name = user?.name || 'Operator';
  const clearance = user?.clearance || 'Level Alpha-4';

  return (
    <header className="fixed top-0 inset-x-0 h-14 bg-slate-950/70 backdrop-blur border-b border-slate-800 flex items-center z-40">
      <div className="max-w-6xl mx-auto w-full px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-200">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
          <span className="font-semibold">Service Routing Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs text-slate-400">
            <div className="font-medium text-slate-200 text-sm">{name}</div>
            <div className="opacity-80">{clearance}</div>
          </div>
          <button
            onClick={async () => { try { await logout(); } catch {} router.push('/login'); }}
            className="px-3 py-1.5 text-sm rounded border border-slate-700 text-slate-200 hover:bg-slate-800"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

