"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type Requirement = { type: string; state: "AVAILABLE" | "EXPIRED" | "MISSING" | "UNKNOWN"; expiresAt?: string | null };
type AssistantData = {
  message: string;
  nextAction: "START_SERVICE" | "VIEW_REQUIREMENTS" | "ASK_CLARIFICATION" | "NONE";
  matchedServices: Array<{ serviceCode: string; title: string; nameNe: string; authority: string; confidence: number }>;
  context?: { requirements: Requirement[] };
  disclaimer: string;
};

const examples = [
  "मेरो driving licence expire हुन लाग्यो, के गर्नुपर्छ?",
  "How can I verify my academic certificate?",
  "मलाई मेरो insurance status हेर्नु छ"
];

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function AssistantPage() {
  const [message, setMessage] = useState(examples[0]);
  const [data, setData] = useState<AssistantData | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"personalized" | "public">("personalized");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!message.trim()) return;
    setLoading(true);
    setError("");
    try {
      const endpoint = mode === "personalized" ? "/v1/ai/assistant/personalized" : "/v1/ai/assistant";
      const response = await fetch(apiUrl + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message })
      });
      if (!response.ok) throw new Error("The assistant request could not be completed. If personalized mode fails, try public mode or sign in first.");
      const payload = await response.json();
      setData(payload.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui" }}>
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 24px 56px" }}>
      <Link href="/dashboard" style={{ color: "#0f766e", textDecoration: "none" }}>← Dashboard</Link>
      <section style={{ marginTop: 18, padding: 28, borderRadius: 20, background: "#0f766e", color: "white" }}>
        <p style={{ margin: 0, opacity: .85, fontWeight: 700 }}>CITIZENOS AI</p>
        <h1 style={{ margin: "8px 0", fontSize: 32 }}>Citizen Service Assistant</h1>
        <p style={{ margin: 0, opacity: .9, maxWidth: 700 }}>Describe what you need in Nepali or English. CitizenOS will match your request to available services and, when authenticated, check relevant prototype credentials.</p>
      </section>

      <section style={{ marginTop: 20, background: "white", border: "1px solid #e2e8f0", borderRadius: 18, padding: 22 }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
          {(["personalized", "public"] as const).map(item => <button key={item} type="button" onClick={() => setMode(item)} style={{ border: "1px solid #cbd5e1", background: mode === item ? "#0f766e" : "white", color: mode === item ? "white" : "#0f172a", padding: "9px 13px", borderRadius: 999, cursor: "pointer", fontWeight: 700 }}>{item === "personalized" ? "Personalized" : "Public"}</button>)}
        </div>
        <form onSubmit={submit}>
          <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} placeholder="Ask about a government service..." style={{ width: "100%", boxSizing: "border-box", padding: 14, borderRadius: 12, border: "1px solid #cbd5e1", font: "inherit", resize: "vertical" }} />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
            <button disabled={loading} style={{ background: "#0f766e", color: "white", border: 0, borderRadius: 10, padding: "12px 18px", cursor: loading ? "wait" : "pointer", fontWeight: 700 }}>{loading ? "Checking..." : "Ask CitizenOS AI"}</button>
            {examples.map(example => <button key={example} type="button" onClick={() => setMessage(example)} style={{ background: "#f1f5f9", color: "#334155", border: "1px solid #e2e8f0", borderRadius: 10, padding: "8px 11px", cursor: "pointer" }}>Example</button>)}
          </div>
        </form>
        {error && <p style={{ marginTop: 16, color: "#b91c1c" }}>{error}</p>}
      </section>

      {data && <section style={{ marginTop: 20, display: "grid", gap: 16 }}>
        <article style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 18, padding: 22 }}>
          <h2 style={{ marginTop: 0 }}>Guidance</h2>
          <p style={{ lineHeight: 1.7, color: "#334155" }}>{data.message}</p>
          <p style={{ color: "#64748b", fontSize: 13 }}>{data.disclaimer}</p>
        </article>

        {data.context && <article style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 18, padding: 22 }}>
          <h2 style={{ marginTop: 0 }}>Requirement status</h2>
          <div style={{ display: "grid", gap: 10 }}>
            {data.context.requirements.map(item => <div key={item.type} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: 14, background: "#f8fafc", borderRadius: 12 }}>
              <span>{item.type.replaceAll("_", " ")}</span>
              <strong style={{ color: item.state === "AVAILABLE" ? "#047857" : item.state === "EXPIRED" || item.state === "MISSING" ? "#b45309" : "#64748b" }}>{item.state}</strong>
            </div>)}
          </div>
        </article>}

        {data.matchedServices.map(service => <article key={service.serviceCode} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 18, padding: 22 }}>
          <p style={{ margin: 0, color: "#64748b" }}>{service.authority}</p>
          <h2 style={{ margin: "6px 0" }}>{service.title}</h2>
          <p>{service.nameNe}</p>
          <p style={{ color: "#64748b" }}>Match confidence: {Math.round(service.confidence * 100)}%</p>
          <Link href={"/dashboard/services/" + encodeURIComponent(service.serviceCode)} style={{ color: "#0f766e", fontWeight: 700 }}>View requirements →</Link>
        </article>)}

        {data.nextAction === "START_SERVICE" && data.matchedServices[0]?.serviceCode === "transport.licence.renewal" && <Link href="/dashboard/services/transport" style={{ textAlign: "center", background: "#0f766e", color: "white", textDecoration: "none", padding: 14, borderRadius: 12, fontWeight: 700 }}>Start Driving Licence Renewal →</Link>}
      </section>}
    </div>
  </main>;
}
