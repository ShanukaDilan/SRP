import { useState } from 'react';
import useSWR from 'swr';
import Navbar from '../../components/Navbar';
import { useUser } from '../../src/lib/useUser';
import { adminGetUsers, adminCreateUser, adminUpdateUser, adminGetRoles, adminCreateRole, adminUpdateRole } from '../../src/lib/api';
import { can } from '../../src/lib/perm';

const fetcher = (key) => {
  if (key === 'admin-users') return adminGetUsers();
  if (key === 'admin-roles') return adminGetRoles();
  return null;
};

export default function AdminUsers() {
  const { user } = useUser(null);
  const { data: users, mutate: refreshUsers } = useSWR('admin-users', fetcher);
  const { data: roles, mutate: refreshRoles } = useSWR('admin-roles', fetcher);

  const [newUser, setNewUser] = useState({ name: '', username: '', email: '', mobile: '', password: '', password_confirmation: '', role_id: '', active: true });
  const [newRole, setNewRole] = useState({ name: '', permissions: ['manage-users'] });
  const [error, setError] = useState('');

  const createUser = async (e) => {
    e.preventDefault(); setError('');
    try { await adminCreateUser(newUser); setNewUser({ name:'', username:'', email:'', mobile:'', password:'', password_confirmation:'', role_id:'', active:true }); refreshUsers(); }
    catch (err) { setError(err.message || 'Failed'); }
  };

  const createRole = async (e) => {
    e.preventDefault(); setError('');
    try { await adminCreateRole(newRole); setNewRole({ name:'', permissions:['manage-users'] }); refreshRoles(); }
    catch (err) { setError(err.message || 'Failed'); }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar user={user} />
      <div className="pt-16 max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="lg:col-span-1 bg-slate-900/70 border border-slate-800 rounded-xl p-4" style={{opacity: can(user,'users','write') ? 1 : 0.5, pointerEvents: can(user,'users','write') ? 'auto' : 'none'}}>
          <h2 className="text-slate-200 font-semibold mb-3">Create User</h2>
          <form onSubmit={createUser} className="space-y-2 text-sm">
            <input className="w-full bg-slate-950 border border-slate-800 rounded p-2" placeholder="Name" value={newUser.name} onChange={(e)=>setNewUser({...newUser,name:e.target.value})} required />
            <input className="w-full bg-slate-950 border border-slate-800 rounded p-2" placeholder="Username" value={newUser.username} onChange={(e)=>setNewUser({...newUser,username:e.target.value})} required />
            <input className="w-full bg-slate-950 border border-slate-800 rounded p-2" placeholder="Email" type="email" value={newUser.email} onChange={(e)=>setNewUser({...newUser,email:e.target.value})} required />
            <input className="w-full bg-slate-950 border border-slate-800 rounded p-2" placeholder="Mobile" value={newUser.mobile} onChange={(e)=>setNewUser({...newUser,mobile:e.target.value})} />
            <select className="w-full bg-slate-950 border border-slate-800 rounded p-2" value={newUser.role_id} onChange={(e)=>setNewUser({...newUser,role_id:e.target.value})}>
              <option value="">No role</option>
              {(roles||[]).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <input className="w-full bg-slate-950 border border-slate-800 rounded p-2" placeholder="Password" type="password" value={newUser.password} onChange={(e)=>setNewUser({...newUser,password:e.target.value})} required />
            <input className="w-full bg-slate-950 border border-slate-800 rounded p-2" placeholder="Confirm Password" type="password" value={newUser.password_confirmation} onChange={(e)=>setNewUser({...newUser,password_confirmation:e.target.value})} required />
            <label className="flex items-center gap-2 text-slate-300"><input type="checkbox" checked={newUser.active} onChange={(e)=>setNewUser({...newUser,active:e.target.checked})}/> Active</label>
            <button className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white">Add User</button>
          </form>
          {error && <p className="text-red-400 mt-2 text-sm">{ /403/.test(error) ? "Forbidden: you need manage-users permission." : error }</p>}
        </section>

        <section className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <h2 className="text-slate-200 font-semibold mb-3">Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-slate-400">
                <tr><th className="py-2">ID</th><th>Name</th><th>Username</th><th>Email</th><th>Role</th><th>Status</th></tr>
              </thead>
              <tbody>
                {(users||[]).map(u => (
                  <tr key={u.id} className="border-t border-slate-800">
                    <td className="py-2">{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.username || '-'}</td>
                    <td>{u.email}</td>
                    <td>{u.role?.name || '-'}</td>
                    <td>{u.active ? 'Active' : 'Blocked'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="lg:col-span-3 bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <h2 className="text-slate-200 font-semibold mb-3">Roles</h2>
          <form onSubmit={createRole} className="flex gap-2 items-center text-sm mb-3">
            <input className="flex-1 bg-slate-950 border border-slate-800 rounded p-2" placeholder="Role name" value={newRole.name} onChange={(e)=>setNewRole({...newRole,name:e.target.value})} required />
            <button className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white">Add Role</button>
          </form>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {(roles||[]).map(r => (
              <div key={r.id} className="p-3 border border-slate-800 rounded bg-slate-950">
                <div className="text-slate-200 font-medium mb-1">{r.name}</div>
                <div className="text-xs text-slate-400">System perms: {(r.permissions?.system||[]).join(', ')||'none'}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}


