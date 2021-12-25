-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('EUR', 'PLN', 'HKD', 'USD');

-- AlterTable
ALTER TABLE "ExpenditureRecord" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT E'EUR',
ADD COLUMN     "exchangeRate" DOUBLE PRECISION NOT NULL DEFAULT 1;
