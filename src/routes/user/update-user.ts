import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";

export async function updateUser(app: FastifyInstance) {
  app.put("/user/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const { firstname, surname, email } = request.body as {
      firstname?: string;
      surname?: string;
      email?: string;
    };

    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      return reply.status(404).send({ message: "User not found" });
    }

    if (!firstname && !surname && !email) {
      return reply
        .status(400)
        .send({ message: "At least one field must be provided to update" });
    }

    await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        firstname: firstname || existingUser.firstname,
        surname: surname || existingUser.surname,
        email: email || existingUser.email,
      },
    });

    return reply.status(204).send();
  });
}
