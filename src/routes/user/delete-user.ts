import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";

export async function deleteUser(app: FastifyInstance) {
  app.delete(
    "/user/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };

      const existingUser = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingUser) {
        return reply.status(404).send({ message: "User not found" });
      }

      await prisma.user.delete({
        where: { id: parseInt(id) },
      });

      return reply.status(204).send();
    }
  );
}
