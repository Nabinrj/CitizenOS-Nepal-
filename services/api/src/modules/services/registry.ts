export type ServiceDefinition = {
  code: string;
  name: { en: string; ne: string };
  authority: string;
  category: "transport" | "education" | "insurance" | "identity" | "tax";
  requiredCredentials: string[];
  consentScopes: string[];
  workflow: string;
  paymentRequired: boolean;
  status: "prototype" | "integration_required";
};

export const SERVICE_REGISTRY: ServiceDefinition[] = [
  {
    code: "transport.licence.renewal",
    name: { en: "Driving Licence Renewal", ne: "सवारी चालक अनुमतिपत्र नवीकरण" },
    authority: "Department of Transport Management",
    category: "transport",
    requiredCredentials: ["DRIVING_LICENCE", "INSURANCE"],
    consentScopes: ["credential.driving_licence.read", "insurance.status.read"],
    workflow: "transport.licence.renewal.v1",
    paymentRequired: true,
    status: "prototype"
  },
  {
    code: "transport.vehicle.registration",
    name: { en: "Vehicle Registration", ne: "सवारी दर्ता" },
    authority: "Department of Transport Management",
    category: "transport",
    requiredCredentials: ["VEHICLE_REGISTRATION"],
    consentScopes: ["credential.vehicle_registration.read"],
    workflow: "transport.vehicle.registration.v1",
    paymentRequired: true,
    status: "integration_required"
  },
  {
    code: "education.credential.verify",
    name: { en: "Academic Credential Verification", ne: "शैक्षिक प्रमाणपत्र प्रमाणीकरण" },
    authority: "Authorized Education Institution",
    category: "education",
    requiredCredentials: ["ACADEMIC_CERTIFICATE"],
    consentScopes: ["credential.academic_certificate.read"],
    workflow: "education.credential.verify.v1",
    paymentRequired: false,
    status: "prototype"
  },
  {
    code: "insurance.status",
    name: { en: "Insurance Status", ne: "बीमा स्थिति" },
    authority: "Authorized Insurance Provider",
    category: "insurance",
    requiredCredentials: ["INSURANCE"],
    consentScopes: ["credential.insurance.read"],
    workflow: "insurance.status.v1",
    paymentRequired: false,
    status: "prototype"
  }
];

export function getService(code: string) {
  return SERVICE_REGISTRY.find((service) => service.code === code);
}
