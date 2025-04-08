/*
  Warnings:

  - You are about to drop the column `assignedTo` on the `Project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_assignedTo_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "assignedTo",
ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
