import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";

export async function getListProduct(app: FastifyInstance) {
  app.get(
    "/product/search",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const {
        limit = "12",
        page = "1",
        fields,
        match,
        category_ids,
        price_range,
        ...options
      } = request.query as any;

      try {
        const take = limit === "-1" ? undefined : Number(limit) || 12;
        const skip = take !== undefined ? (Number(page) - 1) * take : undefined;

        const where: any = {};

        if (match) {
          where.OR = [
            { name: { contains: match, mode: "insensitive" } },
            { description: { contains: match, mode: "insensitive" } },
          ];
        }

        if (category_ids) {
          where.categories = {
            some: {
              id: {
                in: category_ids.split(",").map((id: string) => Number(id)),
              },
            },
          };
        }

        if (price_range) {
          const [minPrice, maxPrice] = price_range
            .split("-")
            .map((p: string) => parseFloat(p));
          where.price = { gte: minPrice, lte: maxPrice };
        }

        if (Object.keys(options).length > 0) {
          where.options = {
            some: {
              OR: Object.entries(options).map(([key, value]) => ({
                id: Number(key),
                values: { hasSome: (value as string).split(",") },
              })),
            },
          };
        }

        const select: any = {};
        if (fields) {
          fields.split(",").forEach((field: string) => {
            select[field] = true;
          });
        }

        const products = await prisma.product.findMany({
          where,
          take,
          skip,
          select: {
            id: true,
            enabled: true,
            name: true,
            slug: true,
            stock: true,
            description: true,
            price: true,
            priceWithDiscount: true,
            categories: { select: { id: true } },
            images: { select: { id: true, path: true } },
            options: { select: { id: true, title: true, values: true } },
            ...select,
          },
        });

        const total = await prisma.product.count({ where });

        return reply.status(200).send({
          data: products,
          total,
          limit: take,
          page: Number(page),
        });
      } catch (error) {
        console.error("Error fetching products:", error);
        return reply.status(500).send({ message: "Internal server error" });
      }
    }
  );
}
