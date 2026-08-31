import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { registerHealthRoutes } from "./modules/health/routes.js";

const app = Fastify({ logger: true });
await app.register(helmet);
await app.register(cors, { origin: process.env.CITIZEN_WEB_URL ?? "http://localhost:3000", credentials: true });
await app.register(rateLimit, { max: 100, timeWindow: "1 minute" });
app.get("/v1", async () => ({ name: "CitizenOS Nepal API", version: "0.1.0", status: "prototype" }));
await registerHealthRoutes(app);
const port = Number(process.env.API_PORT ?? 4000);
await app.listen({ port, host: "0.0.0.0" });
