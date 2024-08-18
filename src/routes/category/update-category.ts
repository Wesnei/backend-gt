import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";
import { z } from "zod";

export async function updateCategory(app: FastifyInstance) {
  app.put(
    "/category/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const updateCategorySchema = z.object({
        name: z.string().min(1, { message: "Name is required" }),
        slug: z.string().min(1, { message: "Slug is required" }),
        use_in_menu: z.boolean(),
      });

      const { id } = request.params as { id: string };
      const { name, slug, use_in_menu } = updateCategorySchema.parse(
        request.body
      );

      try {
        const category = await prisma.category.findUnique({
          where: { id: Number(id) },
        });

        if (!category) {
          return reply.status(404).send({ message: "Category not found" });
        }

        await prisma.category.update({
          where: { id: Number(id) },
          data: {
            name,
            slug,
            useInMenu: use_in_menu,
          },
        });

        return reply.status(204).send();
      } catch (error) {
        console.error("Error updating category:", error);
        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );
}
