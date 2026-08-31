"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch(`${API}/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error?.message ?? "Login failed.");
      localStorage.setItem("citizenos_session", payload.data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, fontFamily: "system-ui" }}>
      <form onSubmit={submit} style={{ width: "100%", maxWidth: 420, border: "1px solid #e2e8f0", borderRadius: 20, padding: 28 }}>
        <p style={{ color: "#475569", marginTop: 0 }}>CitizenOS Nepal</p>
        <h1>Sign in</h1>
        <p style={{ color: "#64748b" }}>Use a prototype account to enter the citizen dashboard.</p>
        <label style={{ display: "block", marginTop: 20 }}>Email<input required type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ display: "block", width: "100%", marginTop: 8, padding: 12, boxSizing: "border-box" }} /></label>
        <label style={{ display: "block", marginTop: 16 }}>Password<input required type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ display: "block", width: "100%", marginTop: 8, padding: 12, boxSizing: "border-box" }} /></label>
        {error && <p role="alert" style={{ color: "#b91c1c" }}>{error}</p>}
        <button disabled={pending} type="submit" style={{ width: "100%", marginTop: 20, padding: 12, cursor: pending ? "wait" : "pointer" }}>{pending ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}
