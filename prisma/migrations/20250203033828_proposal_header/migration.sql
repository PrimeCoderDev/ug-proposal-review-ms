/*
  Warnings:

  - You are about to drop the column `resarch_subline` on the `proposal_header` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "proposal_header" DROP COLUMN "resarch_subline",
ADD COLUMN     "research_subline" TEXT,
ALTER COLUMN "modality" DROP NOT NULL,
ALTER COLUMN "research_line" DROP NOT NULL;
