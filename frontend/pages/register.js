import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import { register } from "../src/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await register({ name, email, password });
      router.push("/profile");
    } catch (err) {
      setError(err?.message || JSON.stringify(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1>Register</h1>
      <form onSubmit={onSubmit}>
        <label>Name<br/>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <br/>
        <label>Email<br/>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <br/>
        <label>Password<br/>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <br/>
        <button type="submit" disabled={submitting}>{submitting ? "Registering…" : "Register"}</button>
      </form>
      {error && <p style={{ color: "crimson" }}>{String(error)}</p>}
      <p>Already have an account? <Link href="/login">Login</Link></p>
    </main>
  );
}

