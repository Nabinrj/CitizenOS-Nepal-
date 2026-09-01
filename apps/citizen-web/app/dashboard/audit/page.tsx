"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AuditEvent = {
  id: string; actorType: string; action: string; resourceType: string;
  resourceId?: string | null; purposeCode?: string | null; outcome: string;
  correlationId?: string | null; createdAt: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function AuditPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(apiUrl + "/v1/audit/access-history", { credentials: "include" })
      .then(async (response) => {
        if (response.status === 401) throw new Error("Please sign in to view your access history.");
        if (!response.ok) throw new Error("Unable to load access history.");
        return response.json();
      })
      .then((payload) => setEvents(payload.data ?? []))
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load access history."))
      .finally(() => setLoading(false));
  }, []);

  return <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui" }}>
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 24px" }}>
      <Link href="/dashboard" style={{ color: "#0f766e" }}>← Dashboard</Link>
      <h1>Access History</h1>
      <p style={{ color: "#64748b" }}>Review recorded activity associated with your CitizenOS account.</p>

      {loading && <p>Loading access history...</p>}
      {error && <section style={{ padding: 18, background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 14 }}>{error}</section>}
      {!loading && !error && events.length === 0 && <section style={{ padding: 20, background: "white", border: "1px solid #e2e8f0", borderRadius: 16 }}>No recorded events yet.</section>}
      {!loading && !error && events.length > 0 && <section style={{ display: "grid", gap: 12 }}>
        {events.map((event) => <article key={event.id} style={{ padding: 18, background: "white", border: "1px solid #e2e8f0", borderRadius: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <strong>{event.action.replaceAll("_", " ")}</strong>
            <span>{new Date(event.createdAt).toLocaleString()}</span>
          </div>
          <p style={{ marginBottom: 0, color: "#475569" }}>
            {event.resourceType}{event.resourceId ? " • " + event.resourceId : ""} • Outcome: {event.outcome}
            {event.purposeCode ? " • Purpose: " + event.purposeCode : ""}
          </p>
        </article>)}
      </section>}
    </div>
  </main>;
}
