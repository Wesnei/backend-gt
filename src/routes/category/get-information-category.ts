import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";

export async function getInformationCategory(app: FastifyInstance) {
  app.get(
    "/category/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };

      try {
        const category = await prisma.category.findUnique({
          where: {
            id: Number(id),
          },
        });

        if (!category) {
          return reply.status(404).send({ message: "Category not found" });
        }

        return reply.status(200).send({
          id: category.id,
          name: category.name,
          slug: category.slug,
          use_in_menu: category.useInMenu,
        });
      } catch (error) {
        console.error("Error fetching category by ID:", error);
        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );
}
