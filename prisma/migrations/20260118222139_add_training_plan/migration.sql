/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `workouts` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledDate` on the `workouts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "workouts" DROP COLUMN "expiresAt",
DROP COLUMN "scheduledDate",
ADD COLUMN     "trainingPlanId" TEXT;

-- CreateTable
CREATE TABLE "training_plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "studentId" TEXT NOT NULL,
    "personalId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_plans_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "training_plans" ADD CONSTRAINT "training_plans_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_plans" ADD CONSTRAINT "training_plans_personalId_fkey" FOREIGN KEY ("personalId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_trainingPlanId_fkey" FOREIGN KEY ("trainingPlanId") REFERENCES "training_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
