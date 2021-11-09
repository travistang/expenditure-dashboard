/*
  Warnings:

  - You are about to drop the column `name` on the `ExpenditureRecord` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `ExpenditureRecord` table. All the data in the column will be lost.
  - Added the required column `amount` to the `ExpenditureRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `ExpenditureRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExpenditureRecord" DROP COLUMN "name",
DROP COLUMN "tags",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "labels" TEXT[],
ADD COLUMN     "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
