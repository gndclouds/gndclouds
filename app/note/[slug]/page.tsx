import { format, parseISO } from "date-fns";
import { allNotes } from "contentlayer/generated";
import { getMDXComponent } from "next-contentlayer/hooks";

export const generateStaticParams = async () =>
  allNotes.map((note) => ({ slug: note._raw.flattenedPath }));

export const generateMetadata = ({
  params: { slug, title },
}: {
  params: { slug: string; title: string };
}) => {
  const note = allNotes.find((note) => note._raw.flattenedPath === slug);
  const noteTitle = note?.title ?? "Default Title";
  return { title: noteTitle };
};

const NoteLayout = ({ params }: { params: { slug: string } }) => {
  const note = allNotes.find(
    (note) => note._raw.flattenedPath === params.slug
  ) as (typeof allNotes)[number];
  console.log(note);
  const Content = getMDXComponent(note.body.code);

  return (
    <article className="py-8 mx-auto max-w-xl">
      <div className="mb-8 text-center">
        <time
          dateTime={note.publishedAt}
          className="mb-1 text-xs text-gray-600"
        >
          {format(parseISO(note.publishedAt), "yyyy-MM-d, ")}
        </time>
        <h1>{note.title}</h1>
      </div>
      <Content />
    </article>
  );
};

export default NoteLayout;
