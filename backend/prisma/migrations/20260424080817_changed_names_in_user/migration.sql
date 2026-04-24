/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `TimetableEntry` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `f_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `l_name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TimetableEntry" DROP CONSTRAINT "TimetableEntry_courseId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "f_name" TEXT NOT NULL,
ADD COLUMN     "l_name" TEXT NOT NULL;

-- DropTable
DROP TABLE "TimetableEntry";

-- CreateTable
CREATE TABLE "Timetable" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "studentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Timetable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimetableClass" (
    "id" SERIAL NOT NULL,
    "timetableId" INTEGER NOT NULL,
    "courseId" TEXT,
    "subject" VARCHAR(60) NOT NULL,
    "location" VARCHAR(60),
    "day" VARCHAR(10) NOT NULL,
    "startTime" VARCHAR(5) NOT NULL,
    "endTime" VARCHAR(5) NOT NULL,
    "colorIdx" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TimetableClass_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TimetableClass" ADD CONSTRAINT "TimetableClass_timetableId_fkey" FOREIGN KEY ("timetableId") REFERENCES "Timetable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimetableClass" ADD CONSTRAINT "TimetableClass_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
