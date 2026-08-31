"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type Credential = { id: string; type: string; issuerName: string; status: string; expiresAt?: string | null };

export default function VaultPage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [message, setMessage] = useState("Loading your vault…");

  useEffect(() => {
    const token = localStorage.getItem("citizenos_session");
    if (!token) { setMessage("Please sign in first."); return; }
    fetch(`${API}/v1/credentials`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async response => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload?.error?.message ?? "Unable to load credentials.");
        setCredentials(payload.data);
        setMessage("");
      })
      .catch(error => setMessage(error instanceof Error ? error.message : "Unable to load credentials."));
  }, []);

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 32, fontFamily: "system-ui" }}>
      <a href="/dashboard">← Dashboard</a>
      <h1>Digital Vault</h1>
      <p style={{ color: "#64748b" }}>Your CitizenOS credential records.</p>
      {message && <p>{message}</p>}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
        {credentials.map(credential => (
          <article key={credential.id} style={{ border: "1px solid #e2e8f0", borderRadius: 16, padding: 20 }}>
            <p style={{ marginTop: 0, color: "#64748b" }}>{credential.type}</p>
            <h2 style={{ fontSize: 18 }}>{credential.issuerName}</h2>
            <strong>{credential.status}</strong>
            {credential.expiresAt && <p>Expires: {new Date(credential.expiresAt).toLocaleDateString()}</p>}
          </article>
        ))}
      </section>
    </main>
  );
}
