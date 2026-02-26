/*
  Warnings:

  - You are about to drop the column `cpf` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_cpf_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "cpf",
ADD COLUMN     "inviteDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isAdminMaster" BOOLEAN NOT NULL DEFAULT false;
