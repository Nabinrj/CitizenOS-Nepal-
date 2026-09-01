import Link from "next/link";

type Service = {
  code: string;
  name: { en: string; ne: string };
  authority: string;
  category: string;
  paymentRequired: boolean;
  status: "prototype" | "integration_required";
};

const apiUrl = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function getServices(): Promise<Service[]> {
  const response = await fetch(`${apiUrl}/v1/services`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load services");
  const payload = await response.json();
  return payload.data ?? [];
}

export default async function ServicesPage() {
  let services: Service[] = [];
  let error = "";

  try {
    services = await getServices();
  } catch {
    error = "Government services are temporarily unavailable. Please try again later.";
  }

  return <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui" }}>
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
      <Link href="/dashboard" style={{ color: "#0f766e" }}>← Dashboard</Link>
      <h1>Government Services</h1>
      <p style={{ color: "#64748b" }}>Find a service, understand its requirements, and start a guided workflow.</p>

      {error ? <section style={{ marginTop: 24, padding: 20, background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 14, color: "#9a3412" }}>{error}</section> :
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18, marginTop: 24 }}>
        {services.map((service) => {
          const status = service.status === "prototype" ? "Prototype" : "Integration required";
          const href = service.code === "transport.licence.renewal" ? "/dashboard/services/transport" : "/dashboard/services/" + encodeURIComponent(service.code);
          return <article key={service.code} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 16, padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <strong>{service.name.en}</strong>
              <span style={{ fontSize: 12, background: "#ecfdf5", padding: "4px 8px", borderRadius: 999 }}>{status}</span>
            </div>
            <p style={{ marginBottom: 4 }}>{service.name.ne}</p>
            <p style={{ color: "#64748b", fontSize: 14 }}>{service.authority}</p>
            <p style={{ color: "#475569" }}>{service.paymentRequired ? "Payment required" : "No payment currently configured"}</p>
            <Link href={href} style={{ display: "inline-block", marginTop: 8, color: "#0f766e", fontWeight: 700 }}>View service →</Link>
          </article>;
        })}
      </div>}

      {!error && services.length === 0 && <p style={{ marginTop: 24, color: "#64748b" }}>No services are currently available.</p>}
    </div>
  </main>;
}
