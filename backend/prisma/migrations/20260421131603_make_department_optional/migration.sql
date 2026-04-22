/*
  Warnings:

  - You are about to drop the column `courseTitle` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the column `groupId` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the `StudyGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_groupId_fkey";

-- DropForeignKey
ALTER TABLE "StudyGroup" DROP CONSTRAINT "StudyGroup_createdBy_fkey";

-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "courseTitle",
DROP COLUMN "department",
DROP COLUMN "description",
DROP COLUMN "groupId",
DROP COLUMN "year";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "department" DROP NOT NULL,
ALTER COLUMN "level" DROP NOT NULL;

-- DropTable
DROP TABLE "StudyGroup";
