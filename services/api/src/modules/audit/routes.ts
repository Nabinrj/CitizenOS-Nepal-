import type { FastifyInstance } from "fastify";

export async function registerAuditRoutes(app: FastifyInstance) {
  app.get("/v1/audit/access-history", async () => ({
    data: [],
    note: "Persistent audit storage is enabled after authentication and database wiring."
  }));
}
