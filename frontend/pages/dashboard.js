import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProfileCard from '../components/ProfileCard';
import dynamic from 'next/dynamic';
const AIWidget = dynamic(() => import('../components/AIWidget'), { ssr: false });
import StatCard from '../components/StatCard';
import { me } from '../src/lib/api';
import { useUser } from '../src/lib/useUser';

const MOCK_USER = {
  id: 1,
  name: 'Dilan',
  email: 'dilan@example.com',
  created_at: '2025-11-03T05:32:53.000000Z',
  role: 'Senior Routing Officer',
  clearance: 'Level Alpha-4',
};

export default function Dashboard() {
  const { user } = useUser(MOCK_USER);

  const [stats, setStats] = useState({ activeNodes: 0, networkLoad: 0, alerts: 0 });
  useEffect(() => {
    // Compute on client to avoid server/client mismatch during hydration
    const next = {
      activeNodes: Math.floor(70 + Math.random() * 25),
      networkLoad: Math.floor(30 + Math.random() * 50),
      alerts: Math.floor(5 + Math.random() * 40),
    };
    setStats(next);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar user={user || MOCK_USER} />
      <div className="pt-16 max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <ProfileCard user={user || MOCK_USER} />
        </div>

        {/* Main */}
        <div className="md:col-span-2 space-y-4">
          <AIWidget user={user || MOCK_USER} />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard title="Active Nodes" value={stats.activeNodes} color="green" />
            <StatCard title="Network Load" value={stats.networkLoad} color="blue" />
            <StatCard title="Alerts" value={stats.alerts} color="red" />
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
            <a href="/admin" className="inline-block px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm">User Manage</a>
          </div>
        </div>
      </div>
    </div>
  );
}
