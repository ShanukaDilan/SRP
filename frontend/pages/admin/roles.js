import { useMemo, useState } from 'react';
import useSWR from 'swr';
import Navbar from '../../components/Navbar';
import { useUser } from '../../src/lib/useUser';
import { adminGetRoles, adminCreateRole, adminUpdateRole, adminDeleteRole } from '../../src/lib/api';
import { can } from '../../src/lib/perm';

const MODULES = ['users', 'roles']; // extend freely later
const ACTIONS = ['read', 'write', 'modify'];

const fetcher = () => adminGetRoles();

export default function RolesPage() {
  const { user } = useUser(null);
  const { data: roles, mutate } = useSWR('admin-roles', fetcher);
  const [form, setForm] = useState({ name: '', active: true, note: '', permissions: { system: ['manage-users'], modules: {} } });
  const [error, setError] = useState('');

  const toggle = (module, action) => {
    setForm((f) => {
      const next = { ...f, permissions: { ...f.permissions, modules: { ...(f.permissions.modules||{}) } } };
      next.permissions.modules[module] = { ...(next.permissions.modules[module]||{}) , [action]: !(next.permissions.modules[module]?.[action]) };
      return next;
    });
  };

  const submit = async (e) => {
    e.preventDefault(); setError('');
    try { await adminCreateRole(form); setForm({ name:'', active:true, note:'', permissions:{ system:['manage-users'], modules:{} } }); mutate(); }
    catch (err) { setError(err.message || 'Failed'); }
  };

  const onUpdate = async (id, patch) => {
    setError('');
    try { await adminUpdateRole(id, patch); mutate(); }
    catch (err) { setError(err.message || 'Failed'); }
  };

  const onRemove = async (id) => {
    if (!confirm('Remove role?')) return;
    try { await adminDeleteRole(id); mutate(); }
    catch (err) { setError(err.message || 'Failed'); }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar user={user} />
      <div className="pt-16 max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <h2 className="text-slate-200 font-semibold mb-3">Create Role</h2>
          <form onSubmit={submit} className="space-y-3 text-sm" style={{opacity: can(user,'roles','write') ? 1 : 0.5, pointerEvents: can(user,'roles','write') ? 'auto' : 'none'}}>
            <input className="w-full bg-slate-950 border border-slate-800 rounded p-2" placeholder="Role name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
            <label className="flex items-center gap-2 text-slate-300"><input type="checkbox" checked={form.active} onChange={(e)=>setForm({...form,active:e.target.checked})}/> Active</label>
            <textarea className="w-full bg-slate-950 border border-slate-800 rounded p-2" placeholder="Note (optional)" value={form.note} onChange={(e)=>setForm({...form,note:e.target.value})} />
            <div className="text-slate-200 font-medium">Module Permissions</div>
            <div className="space-y-2">
              {MODULES.map(m => (
                <div key={m} className="flex items-center gap-3">
                  <div className="w-24 text-slate-300">{m}</div>
                  {ACTIONS.map(a => (
                    <label key={a} className="text-slate-400 text-xs flex items-center gap-1">
                      <input type="checkbox" checked={!!form.permissions.modules?.[m]?.[a]} onChange={()=>toggle(m,a)} /> {a}
                    </label>
                  ))}
                </div>
              ))}
            </div>
            <button className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white">Add Role</button>
          </form>
          {error && <p className="text-red-400 mt-2 text-sm">{ /403/.test(error) ? 'Forbidden: you need manage-roles permission.' : error }</p>}
        </section>

        <section className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-xl p-4">
          <h2 className="text-slate-200 font-semibold mb-3">Roles</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {(roles||[]).map(r => (
              <div key={r.id} className="p-3 border border-slate-800 rounded bg-slate-950">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-slate-200 font-medium">{r.name}</div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-400 flex items-center gap-1"><input type="checkbox" checked={!!r.active} onChange={(e)=>onUpdate(r.id,{active:e.target.checked})} disabled={!can(user,'roles','modify')} /> Active</label>
                    {can(user,'roles','modify') && <button className="text-xs text-red-400 hover:text-red-300" onClick={()=>onRemove(r.id)}>Remove</button>}
                  </div>
                </div>
                <div className="text-xs text-slate-400 mb-2">Note: {r.note || '-'}</div>
                <div className="text-xs text-slate-400 mb-1">System perms: {(r.permissions?.system||[]).join(', ')||'none'}</div>
                <div className="text-xs text-slate-400">Modules:
                  <div className="mt-1 space-y-1">
                    {MODULES.map(m => (
                      <div key={m} className="flex items-center gap-3">
                        <div className="w-24 text-slate-300">{m}</div>
                        {ACTIONS.map(a => (
                          <label key={a} className="text-slate-400 text-[11px] flex items-center gap-1">
                            <input type="checkbox" checked={!!r.permissions?.modules?.[m]?.[a]} disabled={!can(user,'roles','modify')} onChange={(e)=>onUpdate(r.id,{ permissions: { ...r.permissions, modules: { ...(r.permissions?.modules||{}), [m]: { ...(r.permissions?.modules?.[m]||{}), [a]: e.target.checked } } } })} /> {a}
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
