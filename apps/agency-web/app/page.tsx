"use client";
import { useEffect, useState } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
const role = process.env.NEXT_PUBLIC_AGENCY_ROLE ?? "AGENCY_REVIEWER";

type Workflow = { id: string; serviceType: string; status: string; updatedAt: string; user: { displayName: string }; payments: unknown[] };
type Overview = { totalWorkflows: number; activeWorkflows: number; completedWorkflows: number; recentWorkflows: Workflow[]; services: unknown[] };

export default function AgencyDashboard() {
  const [data, setData] = useState<Overview | null>(null);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [error, setError] = useState("");

  async function load() {
    try {
      const headers = { "x-agency-role": role };
      const [overviewResponse, workflowsResponse] = await Promise.all([
        fetch(apiUrl + "/v1/agency/overview", { headers }),
        fetch(apiUrl + "/v1/agency/workflows", { headers })
      ]);
      if (!overviewResponse.ok || !workflowsResponse.ok) throw new Error("Agency API is unavailable or the prototype role is insufficient.");
      setData((await overviewResponse.json()).data);
      setWorkflows((await workflowsResponse.json()).data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load agency operations.");
    }
  }

  useEffect(() => { void load(); }, []);

  async function decide(id: string, decision: "AGENCY_PROCESSING" | "MANUAL_REVIEW" | "REJECTED" | "COMPLETED") {
    const note = window.prompt("Add an operational note:");
    if (!note) return;
    const response = await fetch(apiUrl + "/v1/agency/workflows/" + id + "/decision", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-agency-role": role },
      body: JSON.stringify({ decision, note })
    });
    if (!response.ok) { setError("Decision failed."); return; }
    await load();
  }

  return <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui", color: "#0f172a" }}>
    <div style={{ maxWidth: 1240, margin: "0 auto", padding: 28 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
        <div><p style={{ margin: 0, color: "#0f766e", fontWeight: 700 }}>CITIZENOS NEPAL</p><h1 style={{ margin: "6px 0" }}>Agency Operations Portal</h1><p style={{ color: "#64748b" }}>Prototype role: {role}</p></div>
        <button onClick={() => void load()} style={{ padding: "10px 16px", borderRadius: 10, border: 0, background: "#0f766e", color: "white" }}>Refresh</button>
      </header>

      {error && <p style={{ padding: 14, background: "#fff7ed", borderRadius: 10 }}>{error}</p>}
      {data && <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, margin: "24px 0" }}>
        {[["Total workflows", data.totalWorkflows], ["Active", data.activeWorkflows], ["Completed", data.completedWorkflows], ["Registered services", data.services.length]].map(([label, value]) => <article key={String(label)} style={{ background: "white", padding: 20, borderRadius: 16, border: "1px solid #e2e8f0" }}><p style={{ margin: 0, color: "#64748b" }}>{label}</p><strong style={{ fontSize: 32 }}>{value}</strong></article>)}
      </section>}

      <section style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 16, padding: 20 }}>
        <h2>Workflow queue</h2>
        <div style={{ display: "grid", gap: 12 }}>
          {workflows.map((workflow) => <article key={workflow.id} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 16 }}>
            <strong>{workflow.serviceType}</strong><p>{workflow.user.displayName} · {workflow.status}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => void decide(workflow.id, "AGENCY_PROCESSING")}>Process</button>
              <button onClick={() => void decide(workflow.id, "MANUAL_REVIEW")}>Manual review</button>
              <button onClick={() => void decide(workflow.id, "COMPLETED")}>Complete</button>
              <button onClick={() => void decide(workflow.id, "REJECTED")}>Reject</button>
            </div>
          </article>)}
        </div>
      </section>
      <p style={{ color: "#64748b", fontSize: 13 }}>Prototype notice: agency authentication currently uses a development role header. Replace this with real agency identities and server-side RBAC before production.</p>
    </div>
  </main>;
}