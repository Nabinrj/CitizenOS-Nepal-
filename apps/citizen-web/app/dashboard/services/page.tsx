import Link from "next/link";

const services = [
  { code: "transport.licence.renewal", title: "Driving Licence Renewal", ne: "सवारी चालक अनुमतिपत्र नवीकरण", authority: "Department of Transport Management", fee: "Payment required", status: "Prototype" },
  { code: "transport.vehicle.registration", title: "Vehicle Registration", ne: "सवारी दर्ता", authority: "Department of Transport Management", fee: "Payment required", status: "Integration required" },
  { code: "education.credential.verify", title: "Academic Credential Verification", ne: "शैक्षिक प्रमाणपत्र प्रमाणीकरण", authority: "Authorized Education Institution", fee: "No payment", status: "Prototype" },
  { code: "insurance.status", title: "Insurance Status", ne: "बीमा स्थिति", authority: "Authorized Insurance Provider", fee: "No payment", status: "Prototype" }
];

export default function ServicesPage() {
  return <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui" }}><div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
    <Link href="/dashboard" style={{ color: "#0f766e" }}>← Dashboard</Link>
    <h1>Government Services</h1><p style={{ color: "#64748b" }}>Find a service, understand its requirements, and start a guided workflow.</p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18, marginTop: 24 }}>
      {services.map(s => <article key={s.code} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 16, padding: 22 }}><div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><strong>{s.title}</strong><span style={{ fontSize: 12, background: "#ecfdf5", padding: "4px 8px", borderRadius: 999 }}>{s.status}</span></div><p style={{ marginBottom: 4 }}>{s.ne}</p><p style={{ color: "#64748b", fontSize: 14 }}>{s.authority}</p><p style={{ color: "#475569" }}>{s.fee}</p><Link href={s.code === "transport.licence.renewal" ? "/dashboard/services/transport" : `/dashboard/services/${encodeURIComponent(s.code)}`} style={{ display: "inline-block", marginTop: 8, color: "#0f766e", fontWeight: 700 }}>View service →</Link></article>)}
    </div>
  </div></main>;
}
