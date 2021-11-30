-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "isGrossBudget" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "matchAllLabels" BOOLEAN NOT NULL DEFAULT false;
