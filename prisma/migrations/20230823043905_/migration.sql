/*
  Warnings:

  - The primary key for the `Timeline` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "_TimelineToMediums" DROP CONSTRAINT "_TimelineToMediums_B_fkey";

-- DropForeignKey
ALTER TABLE "_TimelineToSources" DROP CONSTRAINT "_TimelineToSources_B_fkey";

-- DropForeignKey
ALTER TABLE "_TimelineToTags" DROP CONSTRAINT "_TimelineToTags_B_fkey";

-- AlterTable
ALTER TABLE "Timeline" DROP CONSTRAINT "Timeline_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "slug" DROP NOT NULL,
ALTER COLUMN "link" DROP NOT NULL,
ADD CONSTRAINT "Timeline_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Timeline_id_seq";

-- AlterTable
ALTER TABLE "_TimelineToMediums" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_TimelineToSources" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_TimelineToTags" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "_TimelineToTags" ADD CONSTRAINT "_TimelineToTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Timeline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TimelineToSources" ADD CONSTRAINT "_TimelineToSources_B_fkey" FOREIGN KEY ("B") REFERENCES "Timeline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TimelineToMediums" ADD CONSTRAINT "_TimelineToMediums_B_fkey" FOREIGN KEY ("B") REFERENCES "Timeline"("id") ON DELETE CASCADE ON UPDATE CASCADE;
