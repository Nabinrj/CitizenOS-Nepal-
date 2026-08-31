import Link from "next/link";

const services = [
  ["Digital Vault", "View your verified and demo credentials", "/dashboard/vault"],
  ["Government Services", "Discover available services and requirements", "/dashboard/services"],
  ["Transport Renewal", "Start or track a vehicle/licence renewal", "/dashboard/services/transport"],
  ["Payments", "Review obligations and payment status", "/dashboard/payments"],
  ["Consent", "Control who can access your data", "/dashboard/consent"],
  ["Access History", "See when your information was accessed", "/dashboard/audit"]
] as const;

const quickActions = [
  ["View credentials", "/dashboard/vault"],
  ["Browse services", "/dashboard/services"],
  ["Renew transport document", "/dashboard/services/transport"],
  ["Review consent", "/dashboard/consent"]
] as const;

export default function DashboardPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "system-ui" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 24px 48px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", gap: 24, alignItems: "center" }}>
          <div>
            <p style={{ margin: 0, color: "#0f766e", fontWeight: 700 }}>CITIZENOS NEPAL</p>
            <h1 style={{ margin: "8px 0 6px", fontSize: 34 }}>Your citizen dashboard</h1>
            <p style={{ margin: 0, color: "#64748b" }}>Manage digital credentials, public services, payments and consent from one place.</p>
          </div>
          <Link href="/login" style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid #cbd5e1", textDecoration: "none", color: "#0f172a", background: "white" }}>Sign in</Link>
        </header>

        <section style={{ marginTop: 28, padding: 24, borderRadius: 20, background: "#0f766e", color: "white" }}>
          <p style={{ margin: 0, opacity: .85 }}>Citizen services</p>
          <h2 style={{ margin: "6px 0 8px", fontSize: 26 }}>Everything important in one place.</h2>
          <p style={{ maxWidth: 700, margin: 0, opacity: .9 }}>Start a service, review a credential, or control access to your information without navigating across separate systems.</p>
        </section>

        <section style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 20 }}>Quick actions</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {quickActions.map(([title, href]) => <Link key={href} href={href} style={{ padding: "11px 15px", borderRadius: 10, background: "white", border: "1px solid #e2e8f0", textDecoration: "none", color: "#0f172a", fontWeight: 600 }}>{title}</Link>)}
          </div>
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 16, marginTop: 26 }}>
          {services.map(([title, description, href]) => (
            <Link key={href} href={href} style={{ textDecoration: "none", color: "inherit", border: "1px solid #e2e8f0", borderRadius: 16, padding: 20, background: "white" }}>
              <h2 style={{ marginTop: 0, fontSize: 18 }}>{title}</h2>
              <p style={{ color: "#64748b", lineHeight: 1.5 }}>{description}</p>
              <span style={{ color: "#0f766e", fontWeight: 600 }}>Open →</span>
            </Link>
          ))}
        </section>

        <section style={{ marginTop: 28, padding: 20, borderRadius: 16, background: "#fff", border: "1px solid #e2e8f0" }}>
          <strong>Prototype notice</strong>
          <p style={{ marginBottom: 0, color: "#475569" }}>This interface connects to prototype APIs and synthetic agency/payment adapters. It is not a government service and does not issue authoritative documents.</p>
        </section>
      </div>
    </main>
  );
}
