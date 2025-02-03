/*
  Warnings:

  - You are about to drop the `upload_data` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `principal` to the `proposal_detail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "upload_data" DROP CONSTRAINT "upload_data_id_period_fkey";

-- AlterTable
ALTER TABLE "proposal_detail" ADD COLUMN     "principal" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "upload_data";
