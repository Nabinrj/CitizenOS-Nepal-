import Link from "next/link";

type Service = {
  code: string;
  name: { en: string; ne: string };
  authority: string;
  requiredCredentials: string[];
  consentScopes: string[];
  workflow: string;
  paymentRequired: boolean;
  status: "prototype" | "integration_required";
};

const apiUrl = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function getService(code: string): Promise<Service | null> {
  const response = await fetch(`${apiUrl}/v1/services/${encodeURIComponent(code)}`, { cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Unable to load service");
  const payload = await response.json();
  return payload.data ?? null;
}

function format(value: string) {
  return value.replaceAll("_", " ").replaceAll(".", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const service = await getService(decodeURIComponent(code));

  if (!service) return <main style={{ padding: 40, fontFamily: "system-ui" }}>
    <h1>Service not found</h1>
    <p>The requested service does not exist or is currently unavailable.</p>
    <Link href="/dashboard/services">← Services</Link>
  </main>;

  const status = service.status === "prototype" ? "Prototype" : "Integration required";

  return <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui" }}>
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px" }}>
      <Link href="/dashboard/services" style={{ color: "#0f766e" }}>← Services</Link>
      <section style={{ marginTop: 20, background: "white", border: "1px solid #e2e8f0", borderRadius: 20, padding: 28 }}>
        <span style={{ background: "#ecfdf5", padding: "5px 10px", borderRadius: 999, fontSize: 12 }}>{status}</span>
        <h1>{service.name.en}</h1>
        <p style={{ fontSize: 18 }}>{service.name.ne}</p>
        <p style={{ color: "#64748b" }}>Responsible authority: {service.authority}</p>
        <hr style={{ border: 0, borderTop: "1px solid #e2e8f0", margin: "24px 0" }} />

        <h2>What you need</h2>
        <ul>{service.requiredCredentials.map((item) => <li key={item}>{format(item)}</li>)}</ul>

        <h2>Consent required</h2>
        <ul>{service.consentScopes.map((item) => <li key={item}>{format(item)}</li>)}</ul>

        <h2>Processing</h2>
        <p>{format(service.workflow)}</p>
        <p><strong>{service.paymentRequired ? "Payment required" : "No payment currently configured"}</strong></p>

        {service.code === "transport.licence.renewal" && <Link href="/dashboard/services/transport" style={{ display: "inline-block", marginTop: 10, padding: "12px 18px", borderRadius: 10, background: "#0f766e", color: "white", textDecoration: "none", fontWeight: 700 }}>Start renewal →</Link>}
      </section>
    </div>
  </main>;
}
