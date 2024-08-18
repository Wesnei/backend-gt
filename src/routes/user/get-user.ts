import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";

export async function getUser(app: FastifyInstance) {
  app.get("/user/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id, 10) },
      select: {
        id: true,
        firstname: true,
        surname: true,
        email: true,
      },
    });

    if (!user) {
      return reply.status(404).send({ message: "User not found" });
    }

    return reply.status(200).send(user);
  });
}
