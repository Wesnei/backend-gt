import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";

export async function createUser(app: FastifyInstance) {
  app.post("/user", async (request: FastifyRequest, reply: FastifyReply) => {
    const { firstname, surname, email, password, confirmPassword } =
      request.body as {
        firstname: string;
        surname: string;
        email: string;
        password: string;
        confirmPassword: string;
      };

    if (!firstname || !surname || !email || !password || !confirmPassword) {
      return reply.status(400).send({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return reply.status(400).send({ message: "Passwords do not match" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return reply.status(400).send({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstname,
        surname,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        firstname: true,
        surname: true,
        email: true,
      },
    });

    return reply.status(201).send(newUser);
  });
}
