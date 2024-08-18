import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";

export async function deleteCategory(app: FastifyInstance) {
  app.delete(
    "/category/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };

      try {
        const category = await prisma.category.findUnique({
          where: { id: Number(id) },
        });

        if (!category) {
          return reply.status(404).send({ message: "Category not found" });
        }

        await prisma.category.delete({
          where: { id: Number(id) },
        });

        return reply.status(204).send();
      } catch (error) {
        console.error("Error deleting category:", error);
        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );
}
