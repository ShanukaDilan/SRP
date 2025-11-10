import Link from "next/link";
import { useState } from "react";
import { logout } from "../src/lib/api";
import { useUser } from "../src/lib/useUser";

export default function Home() {
  const [error, setError] = useState(null);
  const { user, loading } = useUser(null);

  return (
    <main style={{ maxWidth: 480, margin: "40px auto", padding: 16 }}>
      <h1>SRP Frontend</h1>
      <p>Backend: {process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080"}</p>
      {loading && <p>Checking session…</p>}
      {!loading && !user && (
        <div>
          <p>You are not logged in.</p>
          <ul>
            <li><Link href="/login">Login</Link></li>
            <li><Link href="/register">Register</Link></li>
          </ul>
        </div>
      )}
      {!loading && user && (
        <div>
          <p>Welcome, <b>{user.name || user.email}</b></p>
          <p><Link href="/dashboard">Go to dashboard</Link></p>
          <button onClick={async () => { try { await logout(); } catch (e) {} location.reload(); }}>Logout</button>
          {error && <p style={{ color: "crimson" }}>{String(error)}</p>}
        </div>
      )}
    </main>
  );
}
