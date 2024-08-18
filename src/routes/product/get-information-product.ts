import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";

export async function getInformationProduct(app: FastifyInstance) {
  app.get(
    "/product/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };

      try {
        const product = await prisma.product.findUnique({
          where: { id: Number(id) },
          include: {
            categories: { select: { id: true } },
            images: { select: { id: true, path: true } },
            options: { select: { id: true, title: true, values: true } },
          },
        });

        if (!product) {
          return reply.status(404).send({ message: "Product not found" });
        }

        return reply.status(200).send({
          id: product.id,
          enabled: product.enabled,
          name: product.name,
          slug: product.slug,
          stock: product.stock,
          description: product.description,
          price: product.price,
          price_with_discount: product.priceWithDiscount,
          category_ids: product.categories.map((category) => category.id),
          images: product.images.map((image) => ({
            id: image.id,
            content: image.path,
          })),
          options: product.options,
        });
      } catch (error) {
        console.error("Error fetching product:", error);
        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );
}
