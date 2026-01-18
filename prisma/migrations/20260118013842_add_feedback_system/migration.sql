-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('OPEN', 'RESOLVED');

-- AlterTable
ALTER TABLE "workouts" ADD COLUMN     "expiresAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "workout_feedbacks" (
    "id" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "FeedbackStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "workout_feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_feedback_responses" (
    "id" TEXT NOT NULL,
    "feedbackId" TEXT NOT NULL,
    "personalId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workout_feedback_responses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "workout_feedbacks" ADD CONSTRAINT "workout_feedbacks_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "workouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_feedbacks" ADD CONSTRAINT "workout_feedbacks_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_feedback_responses" ADD CONSTRAINT "workout_feedback_responses_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "workout_feedbacks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_feedback_responses" ADD CONSTRAINT "workout_feedback_responses_personalId_fkey" FOREIGN KEY ("personalId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
