import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../lib/prisma";

export async function getListCategory(app: FastifyInstance) {
  app.get(
    "/category/search",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const {
        limit = "12",
        page = "1",
        fields = "",
        use_in_menu,
      } = request.query as {
        limit?: string;
        page?: string;
        fields?: string;
        use_in_menu?: string;
      };

      const queryLimit = parseInt(limit, 10);
      const queryPage = parseInt(page, 10);
      const selectFields = fields
        ? fields.split(",")
        : ["id", "name", "slug", "useInMenu"];

      const whereClause =
        use_in_menu === "true"
          ? { useInMenu: true }
          : use_in_menu === "false"
          ? { useInMenu: false }
          : {};

      const categories = await prisma.category.findMany({
        where: whereClause,
        take: queryLimit === -1 ? undefined : queryLimit,
        skip: queryLimit === -1 ? undefined : (queryPage - 1) * queryLimit,
        select: selectFields.reduce((acc, field) => {
          acc[field] = true;
          return acc;
        }, {} as Record<string, boolean>),
      });

      const totalCategories = await prisma.category.count({
        where: whereClause,
      });

      return reply.status(200).send({
        data: categories,
        total: totalCategories,
        limit: queryLimit,
        page: queryPage,
      });
    }
  );
}
