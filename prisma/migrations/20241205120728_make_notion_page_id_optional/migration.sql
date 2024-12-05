/*
  Warnings:

  - A unique constraint covering the columns `[notionPageId]` on the table `Certificate` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Certificate" ADD COLUMN     "authorName" TEXT,
ADD COLUMN     "companyLogo" TEXT,
ADD COLUMN     "courseDescription" TEXT,
ADD COLUMN     "notionPageId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_notionPageId_key" ON "Certificate"("notionPageId");
