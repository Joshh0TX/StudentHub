/*
  Warnings:

  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Quiz` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_quizId_fkey";

-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_createdBy_fkey";

-- AlterTable
ALTER TABLE "Resource" ALTER COLUMN "department" DROP DEFAULT;

-- DropTable
DROP TABLE "Question";

-- DropTable
DROP TABLE "Quiz";
