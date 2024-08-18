import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";

export async function updateProduct(fastify: FastifyInstance) {
  fastify.put("/product/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const {
      enabled,
      name,
      slug,
      stock,
      description,
      price,
      price_with_discount,
      category_ids,
      images,
      options,
    } = request.body as {
      enabled: boolean;
      name: string;
      slug: string;
      stock: number;
      description: string;
      price: number;
      price_with_discount: number;
      category_ids: number[];
      images: Array<{
        id?: number;
        type?: string;
        content?: string;
        deleted?: boolean;
      }>;
      options: Array<{
        id?: number;
        title?: string;
        shape?: string;
        radius?: string;
        type?: string;
        values?: string[];
        deleted?: boolean;
      }>;
    };

    try {
      const updatedProduct = await prisma.product.update({
        where: { id: Number(id) },
        data: {
          enabled,
          name,
          slug,
          stock,
          description,
          price,
          priceWithDiscount: price_with_discount,
          categories: {
            set: category_ids.map((categoryId) => ({ id: categoryId })),
          },
        },
      });

      for (const image of images) {
        if (image.deleted && image.id) {
          await prisma.productImage.delete({ where: { id: image.id } });
        } else if (image.id) {
          await prisma.productImage.update({
            where: { id: image.id },
            data: {
              content: image.content || undefined,
              type: image.type || undefined,
            },
          });
        } else {
          await prisma.productImage.create({
            data: {
              content: image.content!,
              type: image.type!,
              productId: updatedProduct.id,
            },
          });
        }
      }

      for (const option of options) {
        if (option.deleted && option.id) {
          await prisma.productOption.delete({ where: { id: option.id } });
        } else if (option.id) {
          await prisma.productOption.update({
            where: { id: option.id },
            data: {
              radius: option.radius || undefined,
              title: option.title || undefined,
              shape: option.shape || undefined,
              type: option.type || undefined,
              values: option.values || undefined,
            },
          });
        } else {
          await prisma.productOption.create({
            data: {
              title: option.title!,
              shape: option.shape,
              radius: option.radius,
              type: option.type,
              values: option.values!,
              productId: updatedProduct.id,
            },
          });
        }
      }

      return reply.status(204).send();
    } catch (error) {
      console.error(error);
      return reply.status(400).send({ error: "Bad Request" });
    }
  });
}
