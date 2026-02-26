/*
  Warnings:

  - The `preferredDate` column on the `Inquiry` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[inquiryId]` on the table `Venue` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inquiryId` to the `Venue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Inquiry" ALTER COLUMN "phone" DROP NOT NULL,
DROP COLUMN "preferredDate",
ADD COLUMN     "preferredDate" TIMESTAMP(3),
ALTER COLUMN "message" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Venue" ADD COLUMN     "inquiryId" INTEGER NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "notes" DROP NOT NULL,
ALTER COLUMN "lat" DROP NOT NULL,
ALTER COLUMN "lng" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Venue_inquiryId_key" ON "Venue"("inquiryId");

-- AddForeignKey
ALTER TABLE "Venue" ADD CONSTRAINT "Venue_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "Inquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
