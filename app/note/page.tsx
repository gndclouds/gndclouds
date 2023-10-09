import Link from "next/link";
import { compareDesc, format, parseISO } from "date-fns";
import { allNotes, Note } from "contentlayer/generated";
import { getMDXComponent } from "next-contentlayer/hooks";
import PageTitle from "../components/PageTitle";

function NoteCard(note: Note) {
  const Content = getMDXComponent(note.body.code);
  const formattedDate = format(parseISO(note.publishedAt), "yyyy-MM-dd");
  return (
    <div className="mb-8">
      <Link
        href={note.url}
        className="text-blue-700 hover:text-blue-900"
        legacyBehavior
      >
        <div>
          <div className="uppercase ordinal slashed-zero tabular-nums proportional-nums opacity-50">
            {formattedDate}
          </div>
          <div className="font-large">{note.title}</div>
        </div>
      </Link>

      <div className="text-sm">{/* <Content /> */}</div>
    </div>
  );
}

export default function Home() {
  const notes = allNotes;
  const sortedNotes = notes.sort((a, b) =>
    compareDesc(parseISO(a.publishedAt), parseISO(b.publishedAt))
  );
  return (
    <div className="mx-auto">
      <PageTitle title="Notes" />

      {sortedNotes.map((note, idx) => (
        <NoteCard key={idx} {...note} />
      ))}
    </div>
  );
}
