/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `exercises` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "exercises" ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "gifUrl" TEXT,
ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "secondaryMuscles" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "exercises_externalId_key" ON "exercises"("externalId");
