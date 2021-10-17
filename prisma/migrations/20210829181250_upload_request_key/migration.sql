/*
  Warnings:

  - You are about to drop the column `privateKey` on the `UploadRequest` table. All the data in the column will be lost.
  - You are about to drop the column `publicKey` on the `UploadRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UploadRequest" DROP COLUMN "privateKey",
DROP COLUMN "publicKey",
ADD COLUMN     "key" TEXT NOT NULL DEFAULT E'';
