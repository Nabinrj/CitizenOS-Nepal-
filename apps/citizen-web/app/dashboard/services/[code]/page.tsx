import Link from "next/link";

const catalog: Record<string, { title: string; ne: string; authority: string; requirements: string[]; consent: string[]; fee: string; workflow: string; status: string }> = {
  "transport.licence.renewal": {
    title: "Driving Licence Renewal", ne: "सवारी चालक अनुमतिपत्र नवीकरण", authority: "Department of Transport Management",
    requirements: ["Active driving licence credential", "Insurance status", "Identity verification"], consent: ["Driving licence read", "Insurance status read"], fee: "Payment required", workflow: "Transport renewal workflow", status: "Prototype"
  },
  "transport.vehicle.registration": {
    title: "Vehicle Registration", ne: "सवारी दर्ता", authority: "Department of Transport Management",
    requirements: ["Vehicle registration credential", "Identity verification"], consent: ["Vehicle registration read"], fee: "Payment required", workflow: "Vehicle registration workflow", status: "Integration required"
  },
  "education.credential.verify": {
    title: "Academic Credential Verification", ne: "शैक्षिक प्रमाणपत्र प्रमाणीकरण", authority: "Authorized Education Institution",
    requirements: ["Academic certificate"], consent: ["Academic certificate read"], fee: "No payment", workflow: "Credential verification workflow", status: "Prototype"
  },
  "insurance.status": {
    title: "Insurance Status", ne: "बीमा स्थिति", authority: "Authorized Insurance Provider",
    requirements: ["Insurance credential"], consent: ["Insurance read"], fee: "No payment", workflow: "Insurance status workflow", status: "Prototype"
  }
};

export default async function ServiceDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const service = catalog[decodeURIComponent(code)];
  if (!service) return <main style={{ padding: 40, fontFamily: "system-ui" }}><h1>Service not found</h1><Link href="/dashboard/services">← Services</Link></main>;
  return <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui" }}><div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px" }}>
    <Link href="/dashboard/services" style={{ color: "#0f766e" }}>← Services</Link>
    <section style={{ marginTop: 20, background: "white", border: "1px solid #e2e8f0", borderRadius: 20, padding: 28 }}>
      <span style={{ background: "#ecfdf5", padding: "5px 10px", borderRadius: 999, fontSize: 12 }}>{service.status}</span>
      <h1>{service.title}</h1><p style={{ fontSize: 18 }}>{service.ne}</p><p style={{ color: "#64748b" }}>Responsible authority: {service.authority}</p>
      <hr style={{ border: 0, borderTop: "1px solid #e2e8f0", margin: "24px 0" }} />
      <h2>What you need</h2><ul>{service.requirements.map(x => <li key={x}>{x}</li>)}</ul>
      <h2>Consent required</h2><ul>{service.consent.map(x => <li key={x}>{x}</li>)}</ul>
      <h2>Processing</h2><p>{service.workflow}</p><p><strong>{service.fee}</strong></p>
      {code === "transport.licence.renewal" && <Link href="/dashboard/services/transport" style={{ display: "inline-block", marginTop: 10, padding: "12px 18px", borderRadius: 10, background: "#0f766e", color: "white", textDecoration: "none", fontWeight: 700 }}>Start renewal →</Link>}
    </section>
  </div></main>;
}
