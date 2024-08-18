/*
  Warnings:

  - The `values` column on the `ProductOption` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ProductOption" ALTER COLUMN "shape" DROP NOT NULL,
ALTER COLUMN "radius" DROP NOT NULL,
ALTER COLUMN "radius" SET DATA TYPE TEXT,
ALTER COLUMN "type" DROP NOT NULL,
DROP COLUMN "values",
ADD COLUMN     "values" TEXT[];
