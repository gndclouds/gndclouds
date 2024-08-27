import { notFound } from "next/navigation";
import { getLogBySlug } from "@/queries/logs";

interface Params {
  params: {
    slug: string;
  };
}

export default async function LogPage({ params }: Params) {
  const { slug } = params; // `slug` is a single path segment
  const log = await getLogBySlug(slug);

  if (!log) {
    notFound();
  }

  return (
    <div>
      <h1>{log.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: log.metadata.contentHtml }} />
    </div>
  );
}
