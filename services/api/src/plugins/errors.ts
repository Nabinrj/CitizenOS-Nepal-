import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";

export function registerErrorHandling(app: FastifyInstance) {
  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.code(400).send({
        error: { code: "VALIDATION_FAILED", message: "Request validation failed." }
      });
    }
    app.log.error(error);
    return reply.code(500).send({
      error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." }
    });
  });
}
