import { useState } from "react";
import Link from "next/link";
import { logout } from "../src/lib/api";
import { useUser } from "../src/lib/useUser";

export default function ProfilePage() {
  const [error, setError] = useState(null);
  const { user, loading } = useUser(null);

  if (loading) return <main style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}><p>Loading…</p></main>;
  if (!user) return <main style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}><p>Not logged in. <Link href="/login">Login</Link></p></main>;

  return (
    <main style={{ maxWidth: 480, margin: "40px auto", padding: 16 }}>
      <h1>Profile</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <button onClick={async () => { await logout(); location.href = "/"; }}>Logout</button>
      {error && <p style={{ color: "crimson" }}>{String(error)}</p>}
    </main>
  );
}
