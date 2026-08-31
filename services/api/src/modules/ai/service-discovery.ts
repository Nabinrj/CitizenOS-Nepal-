import { SERVICE_REGISTRY } from "../services/registry.js";

export type ServiceDiscoveryResult = {
  serviceCode: string;
  title: string;
  nameNe: string;
  authority: string;
  confidence: number;
  reason: string;
};

const intents: Array<{ code: string; keywords: string[] }> = [
  { code: "transport.licence.renewal", keywords: ["licence", "license", "renew", "expire", "driver", "driving", "लाइसेन्स", "नवीकरण"] },
  { code: "transport.vehicle.registration", keywords: ["vehicle", "registration", "bluebook", "सवारी", "दर्ता", "ब्लूबुक"] },
  { code: "education.credential.verify", keywords: ["degree", "certificate", "academic", "education", "शैक्षिक", "प्रमाणपत्र"] },
  { code: "insurance.status", keywords: ["insurance", "बीमा", "policy"] }
];

export function discoverServices(message: string): ServiceDiscoveryResult[] {
  const text = message.toLowerCase();
  return intents.map((intent) => {
    const score = intent.keywords.reduce((sum, keyword) => sum + (text.includes(keyword.toLowerCase()) ? 1 : 0), 0);
    const service = SERVICE_REGISTRY.find((item) => item.code === intent.code);
    return service && score > 0 ? {
      serviceCode: service.code,
      title: service.name.en,
      nameNe: service.name.ne,
      authority: service.authority,
      confidence: Math.min(0.99, 0.55 + score * 0.12),
      reason: `Matched ${score} service-intent keyword${score === 1 ? "" : "s"}.`
    } : null;
  }).filter((item): item is ServiceDiscoveryResult => item !== null).sort((a, b) => b.confidence - a.confidence);
}
