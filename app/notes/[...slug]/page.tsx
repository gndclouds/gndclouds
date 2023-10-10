import { notFound } from "next/navigation";
import { allNotes } from "contentlayer/generated";

import { Metadata } from "next";
import { Mdx } from "@/components/mdx-components";

interface NoteProps {
  params: {
    slug: string[];
  };
}

async function getNoteFromParams(params: NoteProps["params"]) {
  const slug = params?.slug?.join("/");
  const note = allNotes.find((note) => note.slugAsParams === slug);

  if (!note) {
    null;
  }

  return note;
}

export async function generateMetadata({
  params,
}: NoteProps): Promise<Metadata> {
  const note = await getNoteFromParams(params);

  if (!note) {
    return {};
  }

  return {
    title: note.title,
  };
}

export async function generateStaticParams(): Promise<NoteProps["params"][]> {
  return allNotes.map((note) => ({
    slug: note.slugAsParams.split("/"),
  }));
}

export default async function NotePage({ params }: NoteProps) {
  const note = await getNoteFromParams(params);

  if (!note) {
    notFound();
  }

  return (
    <article className="py-6 prose dark:prose-invert">
      <h1 className="mb-2">{note.title}</h1>

      <hr className="my-4" />
      <Mdx code={note.body.code} />
    </article>
  );
}
