import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";
import { z } from "zod";

export async function createCategory(app: FastifyInstance) {
  app.post(
    "/category",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const createCategorySchema = z.object({
        name: z.string().min(1, { message: "Name is required" }),
        slug: z.string().min(1, { message: "Slug is required" }),
        use_in_menu: z.boolean(),
      });

      const { name, slug, use_in_menu } = createCategorySchema.parse(
        request.body
      );

      try {
        const newCategory = await prisma.category.create({
          data: {
            name,
            slug,
            useInMenu: use_in_menu,
          },
        });

        return reply.status(201).send(newCategory);
      } catch (error) {
        console.error("Error creating category:", error);
        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );
}
