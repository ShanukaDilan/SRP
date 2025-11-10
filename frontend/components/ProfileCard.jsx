import { formatDate, formatUserId } from '../src/utils/format';

export default function ProfileCard({ user }) {
  const u = user || {};
  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
      <h3 className="text-slate-200 font-semibold mb-3">Profile</h3>
      <div className="text-sm text-slate-300 space-y-2">
        <div><span className="text-slate-500">ID:</span> {formatUserId(u.id)}</div>
        <div><span className="text-slate-500">Name:</span> {u.name}</div>
        <div><span className="text-slate-500">Email:</span> {u.email}</div>
        <div><span className="text-slate-500">Role:</span> {u.role || 'Senior Routing Officer'}</div>
        <div><span className="text-slate-500">Clearance:</span> {u.clearance || 'Level Alpha-4'}</div>
        <div><span className="text-slate-500">Joined:</span> {formatDate(u.created_at)}</div>
      </div>
    </div>
  );
}

