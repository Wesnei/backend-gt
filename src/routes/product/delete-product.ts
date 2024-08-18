import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";

export async function deleteProduct(fastify: FastifyInstance) {
  fastify.delete("/product/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const product = await prisma.product.findUnique({
        where: { id: Number(id) },
      });

      if (!product) {
        return reply.status(404).send({ error: "Product not found" });
      }

      await prisma.product.delete({
        where: { id: Number(id) },
      });

      return reply.status(204).send();
    } catch (error) {
      console.error(error);
      return reply.status(400).send({ error: "Bad Request" });
    }
  });
}
