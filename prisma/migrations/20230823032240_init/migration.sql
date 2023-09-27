-- CreateTable
CREATE TABLE "Timeline" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "slug" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "Timeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tags" (
    "id" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medium" (
    "id" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Medium_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TimelineToTags" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_TimelineToSources" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_TimelineToMediums" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Timeline_slug_key" ON "Timeline"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Timeline_link_key" ON "Timeline"("link");

-- CreateIndex
CREATE UNIQUE INDEX "Tags_slug_key" ON "Tags"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Source_slug_key" ON "Source"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Medium_slug_key" ON "Medium"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_TimelineToTags_AB_unique" ON "_TimelineToTags"("A", "B");

-- CreateIndex
CREATE INDEX "_TimelineToTags_B_index" ON "_TimelineToTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TimelineToSources_AB_unique" ON "_TimelineToSources"("A", "B");

-- CreateIndex
CREATE INDEX "_TimelineToSources_B_index" ON "_TimelineToSources"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TimelineToMediums_AB_unique" ON "_TimelineToMediums"("A", "B");

-- CreateIndex
CREATE INDEX "_TimelineToMediums_B_index" ON "_TimelineToMediums"("B");

-- AddForeignKey
ALTER TABLE "_TimelineToTags" ADD CONSTRAINT "_TimelineToTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TimelineToTags" ADD CONSTRAINT "_TimelineToTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Timeline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TimelineToSources" ADD CONSTRAINT "_TimelineToSources_A_fkey" FOREIGN KEY ("A") REFERENCES "Source"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TimelineToSources" ADD CONSTRAINT "_TimelineToSources_B_fkey" FOREIGN KEY ("B") REFERENCES "Timeline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TimelineToMediums" ADD CONSTRAINT "_TimelineToMediums_A_fkey" FOREIGN KEY ("A") REFERENCES "Medium"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TimelineToMediums" ADD CONSTRAINT "_TimelineToMediums_B_fkey" FOREIGN KEY ("B") REFERENCES "Timeline"("id") ON DELETE CASCADE ON UPDATE CASCADE;
