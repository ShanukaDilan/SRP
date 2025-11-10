import Navbar from '../../components/Navbar';
import { useUser } from '../../src/lib/useUser';

export default function AdminHome() {
  const { user } = useUser(null);
  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar user={user} />
      <div className="pt-16 max-w-4xl mx-auto px-4">
        <h1 className="text-slate-200 text-xl font-semibold mb-6">User Management</h1>
        <div className="grid sm:grid-cols-2 gap-4">
          <a href="/admin/roles" className="group block bg-slate-900/70 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition">
            <div className="text-slate-100 text-lg font-medium mb-2">Role Management</div>
            <p className="text-slate-400 text-sm">Create, edit, set permissions and status, or remove roles.</p>
          </a>
          <a href="/admin/details" className="group block bg-slate-900/70 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition">
            <div className="text-slate-100 text-lg font-medium mb-2">Details</div>
            <p className="text-slate-400 text-sm">Manage user records: profile fields, role, status.</p>
          </a>
        </div>
      </div>
    </div>
  );
}

