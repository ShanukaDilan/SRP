const apiHost = process.env.NEXT_PUBLIC_BACKEND_URL || (process.env.NEXT_PUBLIC_API_BASE ? process.env.NEXT_PUBLIC_API_BASE.replace(/\/api\/?$/, "") : "http://localhost:8080");

function getCookie(name) {
  if (typeof document === "undefined") return "";
  const cookies = document.cookie ? document.cookie.split("; ") : [];
  for (const c of cookies) {
    const [k, v] = c.split("=");
    if (k === name) return decodeURIComponent(v);
  }
  return "";
}

async function ensureCsrf() {
  await fetch(`${apiHost}/sanctum/csrf-cookie`, { credentials: "include" });
}

async function jsonOrError(res) {
  if (res.status === 204) return null;
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    try { return await res.json(); } catch {}
  }
  const text = await res.text();
  if (/<!doctype/i.test(text)) return { message: `${res.status} ${res.statusText || 'Error'}` };
  return { message: text || `${res.status} ${res.statusText || 'Error'}` };
}

async function post(path, body) {
  await ensureCsrf();
  const token = getCookie("XSRF-TOKEN");
  const res = await fetch(`${apiHost}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", "Accept": "application/json", "X-XSRF-TOKEN": token || "" },
    body: JSON.stringify(body || {})
  });
  if (!res.ok) {
    const err = await jsonOrError(res);
    throw new Error(err?.message || `Request failed (${res.status})`);
  }
  return res;
}

async function get(path) {
  const res = await fetch(`${apiHost}${path}`, { credentials: "include", headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res;
}

export async function register({ name, email, password }) {
  return post("/register", { name, email, password, password_confirmation: password });
}

export async function login({ email, password }) {
  return post("/login", { email, password });
}

export async function logout() {
  const token = getCookie("XSRF-TOKEN");
  const res = await fetch(`${apiHost}/logout`, {
    method: "POST",
    credentials: "include",
    headers: { "X-XSRF-TOKEN": token || "", "Accept": "application/json" }
  });
  if (!res.ok) throw new Error(`Logout failed (${res.status})`);
}

export async function me() {
  const res = await get("/api/user");
  return res.json();
}

export async function forgotPassword(email) {
  return post("/forgot-password", { email });
}

export async function resetPassword({ token, email, password }) {
  return post("/reset-password", { token, email, password, password_confirmation: password });
}

// Admin: Roles
export async function adminGetRoles() {
  const res = await get('/api/admin/roles');
  return res.json();
}
export async function adminCreateRole(role) {
  const res = await post('/api/admin/roles', role);
  return res.json?.() ?? null;
}
export async function adminUpdateRole(id, data) {
  await ensureCsrf();
  const token = getCookie('XSRF-TOKEN');
  const res = await fetch(`${apiHost}/api/admin/roles/${id}`, {
    method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-XSRF-TOKEN': token || '' }, body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Update failed (${res.status})`);
}
export async function adminDeleteRole(id) {
  await ensureCsrf();
  const token = getCookie('XSRF-TOKEN');
  const res = await fetch(`${apiHost}/api/admin/roles/${id}`, { method: 'DELETE', credentials: 'include', headers: { 'X-XSRF-TOKEN': token || '', 'Accept': 'application/json' } });
  if (!res.ok) throw new Error(`Delete failed (${res.status})`);
}

// Admin: Users
export async function adminGetUsers() {
  const res = await get('/api/admin/users');
  return res.json();
}
export async function adminCreateUser(data) {
  const res = await post('/api/admin/users', data);
  return res.json?.() ?? null;
}
export async function adminUpdateUser(id, data) {
  await ensureCsrf();
  const token = getCookie('XSRF-TOKEN');
  const res = await fetch(`${apiHost}/api/admin/users/${id}`, {
    method: 'PATCH', credentials: 'include', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-XSRF-TOKEN': token || '' }, body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Update failed (${res.status})`);
}
