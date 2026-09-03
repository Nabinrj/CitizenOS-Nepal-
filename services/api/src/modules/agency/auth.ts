export type AgencyRole = "AGENCY_VIEWER" | "AGENCY_REVIEWER" | "AGENCY_ADMIN";

const levels: Record<AgencyRole, number> = {
  AGENCY_VIEWER: 1,
  AGENCY_REVIEWER: 2,
  AGENCY_ADMIN: 3
};

export function getAgencyRole(request: { headers: { [key: string]: string | string[] | undefined } }): AgencyRole | null {
  const raw = request.headers["x-agency-role"];
  const role = Array.isArray(raw) ? raw[0] : raw;
  return role === "AGENCY_VIEWER" || role === "AGENCY_REVIEWER" || role === "AGENCY_ADMIN" ? role : null;
}

export function requireAgencyRole(request: { headers: { [key: string]: string | string[] | undefined } }, minimum: AgencyRole) {
  const role = getAgencyRole(request);
  if (!role || levels[role] < levels[minimum]) {
    const error = new Error("AGENCY_ROLE_REQUIRED");
    (error as Error & { statusCode?: number }).statusCode = 403;
    throw error;
  }
  return role;
}
