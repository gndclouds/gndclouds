-- CreateTable
CREATE TABLE "Type" (
    "id" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TimelineToTypes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Type_slug_key" ON "Type"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_TimelineToTypes_AB_unique" ON "_TimelineToTypes"("A", "B");

-- CreateIndex
CREATE INDEX "_TimelineToTypes_B_index" ON "_TimelineToTypes"("B");

-- AddForeignKey
ALTER TABLE "_TimelineToTypes" ADD CONSTRAINT "_TimelineToTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "Timeline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TimelineToTypes" ADD CONSTRAINT "_TimelineToTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;
