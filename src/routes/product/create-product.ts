import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";

export async function createProduct(app: FastifyInstance) {
  app.post("/product", async (request: FastifyRequest, reply: FastifyReply) => {
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
      images: { type: string; content: string }[];
      options: {
        title: string;
        shape: string;
        radius?: string;
        type: string;
        values: string[];
      }[];
    };

    try {
      const createdProduct = await prisma.product.create({
        data: {
          enabled,
          name,
          slug,
          stock,
          description,
          price,
          priceWithDiscount: price_with_discount,
          categories: {
            connect: category_ids.map((id) => ({ id })),
          },
          images: {
            create: images.map((image) => ({
              path: `https://digital-store-gt-curso-dwfs.vercel.app/media/${slug}/${
                image.type.split("/")[1]
              }`,
              type: image.type,
              content: image.content,
            })),
          },
          options: {
            create: options.map((option) => ({
              title: option.title,
              shape: option.shape,
              radius: option.radius,
              type: option.type,
              values: option.values,
            })),
          },
        },
        include: {
          categories: true,
          images: true,
          options: true,
        },
      });

      return reply.status(201).send({
        id: createdProduct.id,
        enabled: createdProduct.enabled,
        name: createdProduct.name,
        slug: createdProduct.slug,
        stock: createdProduct.stock,
        description: createdProduct.description,
        price: createdProduct.price,
        price_with_discount: createdProduct.priceWithDiscount,
        categories: createdProduct.categories.map((category) => ({
          id: category.id,
          name: category.name,
        })),
        images: createdProduct.images.map((image) => ({
          id: image.id,
          content: image.path,
        })),
        options: createdProduct.options.map((option) => ({
          id: option.id,
          title: option.title,
          shape: option.shape,
          radius: option.radius,
          type: option.type,
          values: option.values,
        })),
      });
    } catch (error) {
      console.error("Error creating product:", error);
      return reply.status(400).send({ message: "Bad Request", error });
    }
  });
}
