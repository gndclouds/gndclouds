-- CreateTable
CREATE TABLE "Format" (
    "id" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Format_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TimelineToFormats" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Format_slug_key" ON "Format"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_TimelineToFormats_AB_unique" ON "_TimelineToFormats"("A", "B");

-- CreateIndex
CREATE INDEX "_TimelineToFormats_B_index" ON "_TimelineToFormats"("B");

-- AddForeignKey
ALTER TABLE "_TimelineToFormats" ADD CONSTRAINT "_TimelineToFormats_A_fkey" FOREIGN KEY ("A") REFERENCES "Format"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TimelineToFormats" ADD CONSTRAINT "_TimelineToFormats_B_fkey" FOREIGN KEY ("B") REFERENCES "Timeline"("id") ON DELETE CASCADE ON UPDATE CASCADE;
