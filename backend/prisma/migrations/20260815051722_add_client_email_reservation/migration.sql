/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "clientEmail" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updatedAt";
