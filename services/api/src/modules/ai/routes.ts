import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { requireAuth } from "../../plugins/auth.js";
import { assistCitizen } from "./assistant.js";
import { discoverServices } from "./service-discovery.js";

const discoverySchema = z.object({ message: z.string().min(2).max(1000) });

export async function registerAiRoutes(app: FastifyInstance) {
  app.post("/v1/ai/service-discovery", async (request) => {
    const { message } = discoverySchema.parse(request.body);
    return { data: { mode: "prototype", authoritative: false, results: discoverServices(message) } };
  });

  app.post("/v1/ai/assistant", async (request) => {
    const { message } = discoverySchema.parse(request.body);
    return { data: await assistCitizen(message) };
  });

  app.post("/v1/ai/assistant/personalized", async (request) => {
    const user = requireAuth(request);
    const { message } = discoverySchema.parse(request.body);
    return { data: await assistCitizen(message, user.id) };
  });
}
