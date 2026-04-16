/*
  Warnings:

  - Added the required column `course_code` to the `StudyGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `course_title` to the `StudyGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `max_members` to the `StudyGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `StudyGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudyGroup" ADD COLUMN     "course_code" TEXT NOT NULL,
ADD COLUMN     "course_title" TEXT NOT NULL,
ADD COLUMN     "max_members" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;
