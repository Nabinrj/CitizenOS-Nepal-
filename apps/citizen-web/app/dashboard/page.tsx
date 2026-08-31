import Link from "next/link";

const services = [
  ["Digital Vault", "View your verified and demo credentials", "/dashboard/vault"],
  ["Transport Renewal", "Start or track a vehicle/licence renewal", "/dashboard/services/transport"],
  ["Payments", "Review obligations and payment status", "/dashboard/payments"],
  ["Consent", "Control who can access your data", "/dashboard/consent"],
  ["Access History", "See when your information was accessed", "/dashboard/audit"]
] as const;

export default function DashboardPage() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 32, fontFamily: "system-ui" }}>
      <header style={{ display: "flex", justifyContent: "space-between", gap: 24, alignItems: "center" }}>
        <div>
          <p style={{ margin: 0, color: "#475569" }}>CitizenOS Nepal</p>
          <h1 style={{ margin: "6px 0" }}>Your citizen dashboard</h1>
          <p style={{ color: "#475569" }}>One place to manage digital credentials, services, payments and consent.</p>
        </div>
        <Link href="/login">Sign in</Link>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 16, marginTop: 32 }}>
        {services.map(([title, description, href]) => (
          <Link key={href} href={href} style={{ textDecoration: "none", color: "inherit", border: "1px solid #e2e8f0", borderRadius: 16, padding: 20 }}>
            <h2 style={{ marginTop: 0, fontSize: 18 }}>{title}</h2>
            <p style={{ color: "#64748b" }}>{description}</p>
          </Link>
        ))}
      </section>

      <section style={{ marginTop: 32, padding: 20, borderRadius: 16, background: "#f8fafc" }}>
        <strong>Prototype notice</strong>
        <p style={{ marginBottom: 0, color: "#475569" }}>
          This interface currently connects to prototype APIs and synthetic agency/payment adapters. It is not a government service and does not issue authoritative documents.
        </p>
      </section>
    </main>
  );
}
