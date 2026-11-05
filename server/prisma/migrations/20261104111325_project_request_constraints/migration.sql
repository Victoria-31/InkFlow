/*
  Warnings:

  - You are about to alter the column `client_note` on the `project` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2000)`.
  - Made the column `size` on table `project` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "project" ALTER COLUMN "size" SET NOT NULL,
ALTER COLUMN "client_note" SET DATA TYPE VARCHAR(2000);

-- Business invariants that Prisma cannot express in schema.prisma (written by hand)
ALTER TABLE "project"
  ADD CONSTRAINT "project_client_budget_min_positive" CHECK ("client_budget_min" > 0),
  ADD CONSTRAINT "project_client_budget_max_positive" CHECK ("client_budget_max" > 0),
  ADD CONSTRAINT "project_client_budget_order" CHECK ("client_budget_min" <= "client_budget_max");
